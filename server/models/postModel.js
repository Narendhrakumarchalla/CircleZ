import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    user : {type: String, required: true, ref: 'User'},
    content: {type: String, required: true},
    image_urls: [{type: String, required: true}],
    post_type: {type: String, enum: ['text', 'image', 'text_with_image'], default: 'text', required: true},
    likes_count: [{type: String, ref: 'User'}],
},{timestamps: true, minimize: false});

const Post = mongoose.model('Post', postSchema);
export default Post;