import express from "express";
import { discoverUsers, followUser, getUserData, getUserProfiles, unFollowUser, updateUserData } from "../controllers/userControllers.js";
import protect from "../middleware/auth.js";
import { upload } from "../config/multer.js";
import { getRecentMessages } from "../controllers/messageControllers.js";

const userRouter = express.Router();

userRouter.get('/data', protect, getUserData);
userRouter.post('/update', upload.fields([{name: 'profile', maxCount:1},{name: 'cover', maxCount:1}]), protect, updateUserData)
userRouter.post('/discover',protect, discoverUsers);
userRouter.post('/follow', protect, followUser)
userRouter.post('/unfollow', protect, unFollowUser);
userRouter.get('/profiles', getUserProfiles);
userRouter.get('/recent-messages', protect, getRecentMessages);

export default userRouter;