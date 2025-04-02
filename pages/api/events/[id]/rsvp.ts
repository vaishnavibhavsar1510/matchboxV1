import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    await client.connect();
    const database = client.db('matchbox');
    const events = database.collection('events');

    const event = await events.findOne({ _id: new ObjectId(id as string) });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const rsvp = event.rsvp || [];
    const isRSVPed = rsvp.includes(email);

    let updatedRSVP;
    if (isRSVPed) {
      updatedRSVP = rsvp.filter((e: string) => e !== email);
    } else {
      updatedRSVP = [...rsvp, email];
    }

    const result = await events.findOneAndUpdate(
      { _id: new ObjectId(id as string) },
      { $set: { rsvp: updatedRSVP } },
      { returnDocument: 'after' }
    );

    res.status(200).json(result.value);
  } catch (error) {
    console.error('Error in RSVP API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
} 