import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { config } from './config/config.js';
import { whatsAppService } from './services/whatsapp.js';
import apiRoutes from './routes/api.js';

const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
}));

// Configure Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    path: '/socket.io/'
});

// Initialize Socket.IO connection
io.on('connection', (socket) => {
    console.log('Client connected');
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Set Socket.IO instance to WhatsApp service
whatsAppService.setSocketIO(io);

// Initialize WhatsApp client
whatsAppService.initializeClient().catch(console.error);

// Use API routes
app.use('/api', apiRoutes);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Bot akan merespon pesan yang dimulai dengan: ${config.prefix}`);
});