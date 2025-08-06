import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import {serve} from 'inngest/express';
import {inngest, functions} from './inngest/index.js'
import {clerkMiddleware} from '@clerk/express'
import userRouter from './routes/userRoutes.js';

const app= express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

app.get('/', (req, res)=>{
    res.send('Hello World!');
})
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});
export default app;