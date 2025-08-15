import express from 'express';
import protect from '../middleware/auth.js';
import { getUserMessages, sendMessage, sseController } from '../controllers/messageControllers.js';
import { upload } from '../config/multer.js';

const messageRouter = express.Router();

messageRouter.get('/:userId', protect, sseController);
messageRouter.post('/send', protect, upload.single("image"), sendMessage);
messageRouter.post('/get', protect, getUserMessages)


export default messageRouter;