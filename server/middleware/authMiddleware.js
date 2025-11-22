/*import jwt from 'jsonwebtoken'

export const authMiddleware=(req,res,next)=>{
    try{
        const authHeader=req.header("Authorization");
    if(!authHeader){
        res.status(401).send("Not valid, cant login");
    }
    const parts=authHeader.split(" ");
    if(parts.length!==2 || parts[0]!='Bearer'){
        res.status(400).send("Invalid");
    }
    const token=parts[1];
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.user=decoded;
    next();

    }catch(e){
        res.status(500).send("Server error")
    }
    
}*/

import jwt from 'jsonwebtoken'

export const authMiddleware=(req,res,next)=>{
    try{
    const authHandler=req.header("Authorization");
    if(!authHandler){
        res.status(401).send("No authorization to allow access");
    }
    const parts=authHandler.split(" ");
    if(parts.length!==2 || parts[0]!=='Bearer'){
        res.status(400).send("Wrong authorization");
    }
    const token=parts[1];
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.user=decoded;
    next();

    }catch(e){
        res.status(500).send("Server Error");
    }

}