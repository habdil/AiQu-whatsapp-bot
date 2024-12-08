// src/index.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { config } from './config/config.js';
import apiRoutes from './routes/api.js';
import { initializeWebSocket } from './websocket/socket.js';
import { whatsAppService } from './services/whatsapp.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

initializeWebSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Bot akan merespon pesan yang dimulai dengan: ${config.prefix}`);
});