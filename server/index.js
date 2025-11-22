import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import { signupRoute,loginRoute,addRoute,viewnotesRoute,deleteRoute,searchRoute } from './routes/Routes.js'
import { authMiddleware } from './middleware/authMiddleware.js'
dotenv.config();
const app=express();
app.use(express.json());
app.use(cors());
const PORT=process.env.PORT;
const MONGO_URI=process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
.then(()=>console.log("Mongo connected"))
.catch(()=>console.log("Mongo error"))
app.post('/register',signupRoute);
app.post('/login',loginRoute);
app.post('/notes',authMiddleware,addRoute)
app.get('/notes',authMiddleware,viewnotesRoute);
app.delete('/notes/:id',authMiddleware,deleteRoute);
app.get('/notes/search',authMiddleware,searchRoute);
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})