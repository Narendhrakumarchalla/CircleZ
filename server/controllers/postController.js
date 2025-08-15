import fs from 'fs';
import imagekit from '../config/imagekit.js';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';

const addPost = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {content, post_type} = req.body;
        const images = req.files ||[];

        let image_urls = [];

        if(images.length){
            image_urls = await Promise.all(
                images.map(async(image)=>{
                    const buffer = fs.readFileSync(image.path);
                    const response = await imagekit.upload({
                        file: buffer,
                        fileName: image.originalname,
                        folder: 'posts'
                    });
                    
                    const url = imagekit.url({
                        path: response.filePath,
                        transformation:[
                            {quality:'auto'},
                            {format: 'webp'},
                            {width:'1280'}
                        ]
                    })

                    return url;
                })
            )
        }

        await Post.create({
            user: userId,
            content,
            image_urls,
            post_type
        })
        res.status(200).json({success: true, message: 'Post added successfully'});
    } catch (error) {
        console.log(`Error in addPost: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//getFeedPosts function

const getFeedPosts = async (req, res) => {
    try {
        const {userId} = req.auth();
        const user = await User.findById(userId);

        const userIds = [userId, ...user.connections, ...user.following];

        const posts = await Post.find({user: {$in: userIds}}).populate('user').sort({createdAt: -1});
        res.status(200).json({success: true, posts});

    } catch (error) {
        console.log(`Error in getFeedPosts: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//like post
const likePost = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {postId} = req.body;

        const post = await Post.findById(postId);
        if(post.likes_count.includes(userId)){
            //if user already liked the post, remove like
            post.likes_count = post.likes_count.filter(id => id !== userId);
            await post.save();
            res.status(200).json({
                success: true,
                message: 'Post unliked successfully'
            })
        }
        else {
            //if user has not liked the post, add like
            post.likes_count.push(userId);
            await post.save();
            res.status(200).json({
                success: true,
                message: 'Post liked successfully'
            })
        }

    } catch (error) {
        console.log(`Error in likePost: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export {
    addPost,
    getFeedPosts,
    likePost
};