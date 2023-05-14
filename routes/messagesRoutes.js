import express from 'express';
import messagesController from '../controllers/messagesController.js';

const router = express.Router();

router.post('/sendMessage', messagesController.sendMessage);

export default router;
