import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import UserRoutes from './src/routes/UserRoutes.js';
import AuthRoutes from './src/routes/AuthRoutes.js';
import MessageRoutes from './src/routes/MessageRoutes.js';
import { verifyJWT } from './src/middleware/VerifyJWT.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use('/api/auth', AuthRoutes);
app.use(verifyJWT);
app.use('/api/user', UserRoutes);
app.use('/api/message', MessageRoutes);

const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // ✅ Register user and join their personal room
  socket.on('register', (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.join(userId.toString()); // personal room for private messages
    console.log(`User ${userId} registered on socket ${socket.id}`);
  });

  // ✅ Join a group room
  socket.on('join_group', (groupId) => {
    socket.join(`group_${groupId}`);
    console.log(`User ${socket.id} joined group ${groupId}`);
  });

  // ✅ Handle disconnect
  socket.on('disconnect', () => {
    for (let [userId, sockId] of connectedUsers.entries()) {
      if (sockId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

export { io };
server.listen(5000, () => {
  console.log("Listening at port", 5000);
});
