import express from 'express';
import protect from '../middleware/auth.js';
import { getUserMessages, sendMessage, sseController } from '../controllers/messageControllers.js';

const messageRouter = express.Router();

messageRouter.get('/:userId', protect, sseController);
messageRouter.post('/send', protect, sendMessage);
messageRouter.get('/get', protect, getUserMessages)


export default messageRouter;