import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/Users.js'
import notesModel from '../models/Notes.js'


export const signupRoute=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).send("Please fill out all the details.")
        }
        if(password.length<6){
            return res.status(400).send("Password must atleast be 6 characters.")
        }
        //existing user
        const existingUser=await userModel.findOne({email})
        if(existingUser){
            return res.status(409).send("User already exists. Please log in to continue.");
        }
        const hash=await bcrypt.genSalt(10);
        const hashedpassword=await bcrypt.hash(password,hash);
        const user=await userModel.create({
            name,
            email,
            password:hashedpassword
        })

        const token=jwt.sign(
            {id:user._id},//payload
            process.env.JWT_SECRET
        )

        res.status(201).json({
            message:"User successfully created",
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            },
            token

        })


    }catch(e){
        if(e.code===11000){
            return res.status(409).send("Username already exists");
        }
        res.status(500).send("Server error");
        console.error(e);

    }

}

export const loginRoute=async(req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email || !password){
            return res.status(400).send("Please fill out all the details");
        }
        //check user
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(404).send("User not found. Please considering signing up first.");
        }
        const matched=await bcrypt.compare(password,user.password);
        if(!matched){
            return res.status(403).send("Password doesnt match. Try again!");
        }

        const token=jwt.sign(
            {id:user.id},
            process.env.JWT_SECRET
        )

        res.status(200).json({
            message:'User logged in successfully',
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            },
            token
        })

    }catch(e){
        
        res.status(500).send("Server error");
        console.error(e);

    }
}


export const addRoute=async(req,res)=>{
    try{
        const{title,body}=req.body;
        if(!title||!body){
            return res.status(400).send("Please enter all of the details");
        }
        const userId=req.user.id;
        const note=await notesModel.create({
            title,
            body,
            userId
        })
        res.status(201).json(note);

    }catch(e){
        res.status(500).send("Server error");

    }
}

export const viewnotesRoute=async(req,res)=>{
    try{
        const notes=await notesModel.find({userId:req.user.id});
        res.status(200).json(notes);
    
    }catch(e){
        res.status(500).send("Server Error");
    }
}


export const deleteRoute=async(req,res)=>{
    try{
        const noteId=req.params.id;
        const deleted=await notesModel.findOneAndUpdate({_id:noteId,userId:req.user.id},
            {isDeleted:true},
            {new:true}
        )

        res.status(200).json(deleted);

    }catch(e){
        res.status(500).send("Server Error");

    }
}


export const searchRoute=async(req,res)=>{
    try{
        const keyword=req.query.q;
        const pinned=req.query.isPinned==="true";
        const del=req.query.isDeleted==="true";
        const result={userId:req.user.id,
            $or:[
                {title:{$regex:keyword,$options:"i"}},
                {body:{$regex:keyword,$options:"i"}}
            ]
        };
        if(pinned){
            result.isPinned=true;
        }
        else if(del){
            result.isDeleted=true;
        }
        const searched=await notesModel.find(result);
        res.status(200).json(searched);


    }catch(e){
        res.status(500).send("Server error");
    }
}

export const pinRoute=async(req,res)=>{
    try{
        const noteId=req.params.id;
        if(!noteId){
            res.status(400).send("Invalid Request");
        }
        const pinned=await notesModel.findOneAndUpdate({
            _id:noteId,
            userId:req.user.id
        },
        {isPinned:true},
        {new:true})
        res.status(200).json(pinned);

    }catch(e){
        res.status(500).send("Server Error");

    }
}

export const unpinRoute=async(req,res)=>{
    try{
        const noteId=req.params.id;
        if(!noteId){
            res.status(400).send("Invalid request");
        }
        const unpinned=await notesModel.findOneAndUpdate({_id:noteId,userId:req.user.id},
            {isPinned:false},
            {new:true}
        )
        res.status(200).json(unpinned);

    }catch(e){
        res.status(500).send("Server error");

    }
}

export const getpinpageRoute=async(req,res)=>{
    try{
        const pinnedpage=await notesModel.find({userId:req.user.id,isPinned:true});
        res.status(200).json(pinnedpage);

    }catch(e){
        res.status(500).send("Server Error");
    }

}

export const trashRoute=async(req,res)=>{
    try{
        const trash=await notesModel.find({
            userId:req.user.id,
            isDeleted:true
        }
        )
        res.status(200).json(trash);

    }catch(e){
        res.status(500).send("Server Error");

    }
}

export const restoreRoute=async(req,res)=>{
    try{
        const noteId=req.params.id;
        if(!noteId){
            res.status(400).send("Invalid request for restore")
        }
        const restored=await notesModel.findOneAndUpdate({
            _id:noteId,
            userId:req.user.id
        },{
            isDeleted:false,
        },{
            new:true
        })
        res.status(200).json(restored);

    }catch(e){
        res.status(500).send("Server Error")

    }
}