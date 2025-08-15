import fs from 'fs'
import imagekit from '../config/imagekit.js';
import Message from '../models/messageModel.js';

let connections = {};

//sse endpoint
const sseController = (req, res) => {
    const { userId } = req.params;
    console.log('New Client added', userId);
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    connections[userId] = res;

    // Send a comment to keep the connection alive
    res.write('log: Connected to SSE stream\n\n');

    req.on('close', () => {
        console.log('Client disconnected', userId);
        delete connections[userId];
    });

}

// send message

const sendMessage = async (req, res) => {
    try {

        const { userId } = req.auth();
        const { to_user_id, text} = req.body;

        const image = req.file;
        console.log(req.body);
        

        let media_url=''
        let message_type = image ? 'image' : 'text';

        if( message_type === 'image' ){
            const buffer = fs.readFileSync(image.path);
            const response = await imagekit.upload(
                {
                    file: buffer,
                    fileName: image.originalname,
                    folder: 'messages'
                }
            )

            media_url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1280' }
                ]
            })
        }
            const newMessage = await Message.create({
                from_user_id: userId,
                to_user_id,
                text,
                media_url,
                message_type
            })

            res.status(200).json({
                success: true,
                message: "Message sent successfully",
                message: newMessage
            })

            //send res to sse endpoint
            const messageWithUserData = await Message.findById(newMessage._id).populate('from_user_id');

            if(connections[to_user_id]) {
                connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
            }
    } catch (error) {
        console.log(`Error in sendMessage: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// const sendMessage = async (req, res) => {
//     try {
//       const { userId } = req.auth();
//       const { to_user_id, text } = req.body;
//       const image = req.file;
  
//       let media_url = '';
//       let message_type = image ? 'image' : 'text';
//       let newMessage;
  
//       if (image) {
//         // upload to imagekit
//         const buffer = fs.readFileSync(image.path);
//         const response = await imagekit.upload({
//           file: buffer,
//           fileName: image.originalname,
//           folder: 'messages'
//         });
  
//         media_url = imagekit.url({
//           path: response.filePath,
//           transformation: [
//             { quality: 'auto' },
//             { format: 'webp' },
//             { width: '1280' }
//           ]
//         });
  
//         newMessage = await Message.create({
//           from_user_id: userId,
//           to_user_id,
//           text: text || '',  // allow empty text if only sending image
//           media_url,
//           message_type
//         });
//       } else {
//         // text-only message
//         if (!text || text.trim() === '') {
//           return res.status(400).json({
//             success: false,
//             message: "Message text cannot be empty"
//           });
//         }
  
//         newMessage = await Message.create({
//           from_user_id: userId,
//           to_user_id,
//           text,
//           message_type
//         });
//       }
  
//       res.status(200).json({
//         success: true,
//         message: "Message sent successfully",
//         messageData: newMessage
//       });
  
//       // Send res to SSE endpoint
//       const messageWithUserData = await Message.findById(newMessage._id).populate('from_user_id');
//       if (connections[to_user_id]) {
//         connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
//       }
  
//     } catch (error) {
//       console.log(`Error in sendMessage: ${error.message}`);
//       res.status(500).json({
//         success: false,
//         message: error.message
//       });
//     }
//   };
  

// get user messages
const getUserMessages = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { to_user_id } = req.body;

        const messages = await Message.find({
            $or: [
                { from_user_id: userId, to_user_id },
                { from_user_id: to_user_id, to_user_id: userId }
            ]
        }).sort({ createdAt: -1 });

        await Message.updateMany(
            { from_user_id: to_user_id, to_user_id: userId, seen: false },
            { $set: { seen: true } }
        );
        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        console.log(`Error in getUserMessages: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// get recent messages
const getRecentMessages = async (req, res) => {
    try {
        const { userId } = req.auth();
        
        const recentMessages = await Message.find({to_user_id: userId }).populate('from_user_id to_user_id')
        .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            messages: recentMessages
        });
    } catch (error) {
        console.log(`Error in getRecentMessages: ${error.message}`);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export {
    sseController,
    sendMessage,
    getUserMessages,
    getRecentMessages
};