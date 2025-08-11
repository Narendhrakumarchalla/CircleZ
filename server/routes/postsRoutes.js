import express from 'express';
import { upload } from '../config/multer.js';
import protect from '../middleware/auth.js';
import { addPost, getFeedPosts, likePost } from '../controllers/postController.js';

const postsRouter = express.Router();

postsRouter.post('/add',upload.array('images', 4), protect,addPost);
postsRouter.get('/feed', protect, getFeedPosts);
postsRouter.post('/like', protect, likePost);


export default postsRouter;