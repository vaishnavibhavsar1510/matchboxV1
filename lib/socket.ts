import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export const initSocket = (server: NetServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('rsvp-update', (event) => {
      io.emit('rsvp-update', event);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

let io: SocketIOServer;

export const getSocketIO = (res: NextApiResponse) => {
  if (!io) {
    const httpServer = res.socket?.server as unknown as NetServer;
    io = initSocket(httpServer);
  }
  return io;
}; 