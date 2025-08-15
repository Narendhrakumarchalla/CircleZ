import fs from 'fs';
import imagekit from '../config/imagekit.js';
import { inngest } from '../inngest/index.js';
import Story from '../models/storyModel.js';
import User from '../models/userModel.js';

const addStory = async (req, res) => {
    try {
        const { userId } = req.auth();
        const {content, media_type, background_color} = req.body;
        let media_url = '';

        const media = req.file; 
        if(media_type === 'image' || media_type === 'video') {
            const buffer = fs.readFileSync(media.path);
            const response = await imagekit.upload({
                file: buffer,
                fileName: media.originalname,
                folder: 'stories'
            })

            media_url = response.url;
        }

        const story = await Story.create({
            user: userId,
            content,
            media_url,
            media_type,
            background_color
        });

        // inngest function 
        await inngest.send({
            name: '/app/story.delete',
            data: {storyId : story._id}
        })

        res.status(200).json({ success: true, message: 'Story added successfully' });

    } catch (error) {
        console.log(`Error in addStory: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getStories = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId).populate('connections following');
        const userIds = [userId, ...user.connections, ...user.following]

        const stories = await Story.find({user:{$in:userIds}}).populate('user').sort({ createdAt: -1 });

        res.status(200).json({ success: true, stories });

    } catch (error) {
        console.log(`Error in getStories: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export { addStory, getStories };