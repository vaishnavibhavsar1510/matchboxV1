import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { io } from 'socket.io-client';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  rsvp: string[];
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { data: session } = useSession();
  const [rsvpStatus, setRsvpStatus] = useState<string[]>(event.rsvp || []);
  const [socket, setSocket] = useState<any>(null);

  React.useEffect(() => {
    const newSocket = io('http://localhost:7000');
    setSocket(newSocket);

    newSocket.on('rsvp-update', (updatedEvent: Event) => {
      if (updatedEvent._id === event._id) {
        setRsvpStatus(updatedEvent.rsvp);
      }
    });

    return () => {
      newSocket.close();
    };
  }, [event._id]);

  const handleRSVP = async () => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch(`/api/events/${event._id}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setRsvpStatus(updatedEvent.rsvp);
        socket?.emit('rsvp-update', updatedEvent);
      }
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };

  const isRSVPed = session?.user?.email && rsvpStatus.includes(session.user.email);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
      <p className="text-gray-600 mb-4">{event.description}</p>
      <div className="text-sm text-gray-500">
        <p>📅 {format(new Date(event.date), 'PPP')}</p>
        <p>📍 {event.location}</p>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          {rsvpStatus.length} {rsvpStatus.length === 1 ? 'person' : 'people'} attending
        </p>
        {session?.user?.email && (
          <button
            onClick={handleRSVP}
            className={`mt-2 px-4 py-2 rounded ${
              isRSVPed
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isRSVPed ? 'Cancel RSVP' : 'RSVP'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard; 