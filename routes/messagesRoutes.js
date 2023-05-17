import express from 'express';
import messagesController from '../controllers/messagesController.js';

const router = express.Router();

router.post('/getMessages', messagesController.getMessages);

router.post('/sendMessage', messagesController.sendMessage);

export default router;
