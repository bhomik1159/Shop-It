import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import user from "../models/userModel.js";

//protect routes
const protect = asyncHandler(async(req,res,next)=>{
    let token;

    token = req.cookies.jwt;
    if(token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await user.findById(decoded.userId).select('-password');
            next();
        }
        catch(error){
            console.log(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }

    }
    else{
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});
//admin
const admin = (req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next();
    }
    else{
        res.status(401);
        throw new Error('Not Authorized to be admin');
    }
};

export {protect,admin};