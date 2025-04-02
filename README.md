# Matchbox V1

A real-time event management application built with Next.js, MongoDB, and Socket.IO.

## Features

- Real-time event updates
- RSVP functionality
- User authentication
- Responsive design

## Prerequisites

- Node.js 14+ installed
- MongoDB running locally or a MongoDB Atlas connection string
- Git

## Setup

1. Clone the repository:
```bash
git clone https://github.com/vaishnavibhavsar1510/matchboxV1.git
cd matchboxV1
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/pages` - Next.js pages and API routes
- `/components` - React components
- `/lib` - Utility functions and configurations
- `/models` - Database models and types
- `/contexts` - React context providers
- `/hooks` - Custom React hooks
- `/styles` - CSS and styling files
- `/public` - Static assets

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 