import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host:'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USER, // your email address
        pass: process.env.SMTP_PASS  // your email password or app password
    }, 
})

const sendEmail = async ({to, subject, body}) => {
    const response = await transporter.sendMail({
        from:process.env.SENDER_EMAIL, // sender address
        to,
        subject,
        html: body
    })
}

export default sendEmail;