// src/routes/api.js
import express from 'express';
import { whatsAppService } from '../services/whatsapp.js';

const router = express.Router();

router.get('/status', (req, res) => {
    res.json({ 
        status: 'active',
        clientReady: whatsAppService.isReady()
    });
});

export default router;