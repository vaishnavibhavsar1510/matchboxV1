import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await client.connect();
    const database = client.db('matchbox');
    const events = database.collection('events');

    switch (req.method) {
      case 'GET':
        const eventsList = await events.find({}).toArray();
        res.status(200).json(eventsList);
        break;

      case 'POST':
        const { title, description, date, location } = req.body;
        const result = await events.insertOne({
          title,
          description,
          date,
          location,
          rsvp: [],
          createdAt: new Date(),
        });
        res.status(201).json({ _id: result.insertedId });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in events API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
} 