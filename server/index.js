import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import { signupRoute,loginRoute,addRoute,viewnotesRoute,deleteRoute,searchRoute, pinRoute, unpinRoute,getpinpageRoute,trashRoute,restoreRoute,archiveRoute,archivedPageRoute,unarchiveRoute,updateRoute } from './routes/Routes.js'
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
app.patch('/notes/delete/:id',authMiddleware,deleteRoute);
app.get('/notes/search',authMiddleware,searchRoute);
app.patch('/notes/pin/:id',authMiddleware,pinRoute);
app.patch('/notes/unpin/:id',authMiddleware,unpinRoute);
app.get('/notes/pin',authMiddleware,getpinpageRoute);
app.get('/notes/delete',authMiddleware,trashRoute)
app.patch('/notes/restore/:id',authMiddleware,restoreRoute);
app.patch('/notes/archive/:id',authMiddleware,archiveRoute);
app.get('/notes/archived',authMiddleware,archivedPageRoute);
app.patch('/notes/unarchive/:id',authMiddleware,unarchiveRoute);
app.patch('/notes/update/:id',authMiddleware,updateRoute);
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})