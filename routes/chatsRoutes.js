import express from 'express';
import chatsController from '../controllers/chatsController.js';

const router = express.Router();

router.get('/getChats', chatsController.getChats);

export default router;
