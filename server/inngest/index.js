import { Inngest } from "inngest";
import User from "../models/userModel.js";
import Connection from "../models/connectionModel.js";
import sendEmail from "../config/nodemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "CircleZ" });
// create a syncUserCreation function 
const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created'},

    async ({ event }) => {
        const {first_name, last_name, email_addresses, image_url, id} = event.data;
        let username = email_addresses[0].email_address.split('@')[0];

        const user = User.findOne({username});
        if(user){
            username = username + Math.floor(Math.random() * 10000);
        }

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            full_name: `${first_name} ${last_name}`,
            username,
            profile_picture: image_url,
        }
        await User.create(userData);
    }
)

//function to update data
const syncUserUpdation = inngest.createFunction(
    {id: 'update-user-from-clerk'},
    {event: 'clerk/user.updated'},

    async ({ event }) => {
        const {first_name, last_name, email_addresses, image_url, id} = event.data;
        const updatedUserData = {
            email: email_addresses[0].email_address,
            full_name: `${first_name} ${last_name}`,
            profile_picture: image_url,
        }

        await User.findByIdAndUpdate(id, updatedUserData);
    }
)

// function to delete user
const syncUserDeletion = inngest.createFunction(
    {id: 'delete-user-with-clerk'},
    {event: 'clerk/user.deleted'},

    async ({ event }) => {
        const {id} = event.data;
        
        await User.findByIdAndDelete(id);
    }
)

//create an function to send email to reminds to get a connection request

const sendConnectionRequestReminder = inngest.createFunction(
    {id: 'send-connection-request-reminder'},
    {event: 'app/connection-request'},

    async ({ event, step }) => {
        const { connectionId } = event.data;
        
        await step.run('send-connection-request-mail', async () => {
            const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id');

            const subject = '👋 New Connection Request';
            const body = `
                <div style="background-color: #f3f4f6; padding: 20px; font-family: Arial, sans-serif;">
                    <h2>Hi ${connection.to_user_id.full_name},</h2>
                    <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username} .</p>
                    <p>Click <a href="${process.env.FRONTEND_URL}/connections" style= "color : #10b981;">here,</a> to accept or decline the request.</p>
                    <br/>
                    <p>Best regards,</p><br/>
                    <p>The <b>CircleZ</b> Team</p>
                </div>
            `;

            // Send the email using your preferred email service

            await sendEmail({
                to: connection.to_user_id.email,
                subject,
                body
            })
        })

        const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await step.sleepUntil(in24Hours);
        

        await step.run('send-connection-request-reminder', async () => {

            const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id');

            if( connection.status === 'accepted' ){
                return {message: 'Connection request accepted, no reminder needed.'};
            }

            const subject = '⏰ Reminder: Connection Request Pending';
            const body = `
                <div style="background-color: #f3f4f6; padding: 20px; font-family: Arial, sans-serif;">
                    <h2>Hi ${connection.to_user_id.full_name},</h2>
                    <p>This is a friendly reminder that you have a pending connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}.</p>
                    <p>Click <a href="${process.env.FRONTEND_URL}/connections" style= "color : #10b981;">here,</a> to accept or decline the request.</p>
                    <br/>
                    <p>Best regards,</p><br/>
                    <p>The <b>CircleZ</b> Team</p>
                </div>
            `;

            // Send the email using your preferred email service
            await sendEmail({
                to: connection.to_user_id.email,
                subject,
                body
            })

            return {message: 'Reminder sent successfully.'};
        })
    }
)


// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    sendConnectionRequestReminder
];