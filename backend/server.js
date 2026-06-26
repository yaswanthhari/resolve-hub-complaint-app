require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://yaswanthhari2004:Yaswanth%401881%40@cluster0.o5hck.mongodb.net/resolvehub?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully to Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};
connectDB();

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_complaint_room', (complaintId) => {
    socket.join(complaintId);
    console.log(`User joined room: ${complaintId}`);
  });

  socket.on('send_message', (data) => {
    // data should contain { complaintId, senderId, content }
    io.to(data.complaintId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Basic route
app.get('/', (req, res) => {
  res.send('Online Complaint Registration API is running');
});

// Specific routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
