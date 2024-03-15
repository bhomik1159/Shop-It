import asyncHandler from "../middleware/asyncHandler.js";
import user from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

const authUser = asyncHandler(async(req,res)=>{
    const {email,password}= req.body;
    const loggedUser =  await user.findOne({email});
    if(loggedUser && (await loggedUser.comparePassword(password))){
        generateToken(res,loggedUser.id);
        res.status(200).json({
            _id: loggedUser._id,
            name: loggedUser.name,
            email: loggedUser.email,
            isAdmin: loggedUser.isAdmin,
        });
        
    }
    else{
        res.status(401);
        throw new Error('Invalid Email or Password');
    }
     
});

const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password}= req.body;
    const userExist = await user.findOne({email});
    if(userExist){
        throw new Error('User already exists');
    }
    const newUser  = await user.create({
        name,
        email,
        password,
    });
    if(newUser){
        generateToken(res,newUser._id);
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        });
    }
    else{
        res.status(401);
        throw new Error('Invalid user data');
    }
     
});

const logoutUser = asyncHandler(async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({message: 'Logged out sucessfully'});
     
});

const getUserProfile = asyncHandler(async(req,res)=>{
    const loggedUser = await user.findById(req.user._id);
    if(loggedUser){
        res.status(200).json({
            _id: loggedUser._id,
            name: loggedUser.name,
            email: loggedUser.email,
            isAdmin: loggedUser.isAdmin,
        });
    }
    else{
        res.status(404);
        throw new Error('No user found');
    }
     
});

const updateUserProfile = asyncHandler(async(req,res)=>{
    const loggedUser = await user.findById(req.user._id);
    if(loggedUser){
        loggedUser.name = req.body.name || loggedUser.name;
        loggedUser.email = req.body.email || loggedUser.email;
        if(req.body.password){
            loggedUser.password = req.body.password;
        }
        const updatedUser = await loggedUser.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    }
    else{
        res.status(400);
        throw new Error('user not found');
    }
     
});

const getAllUsers = asyncHandler(async(req,res)=>{
    const allUsers = await user.find({});
    res.status(200).json(allUsers);
     
});

const getUserById = asyncHandler(async(req,res)=>{
    const userById = await user.findById(req.params.id).select('-password');
    if(userById) {
        res.status(200).json(userById);
    }
    else{
        res.status(404);
        throw new Error('User Not Found');
    }
     
});

const deleteUser = asyncHandler(async(req,res)=>{
    const userToDelete = await user.findById(req.params.id);
    if(userToDelete){
        if(userToDelete.isAdmin){
            res.status(400);
            throw new Error("Cannot Delete admin User");

        }
        await user.deleteOne({_id: userToDelete._id});
        res.status(200).json({message: "User Deleted"});

    }
    else{
        req.status(404);
        throw new Error("user Not Found");
    }
     
});

const updateUser = asyncHandler(async(req,res)=>{
    const userToEdit = await user.findById(req.params.id);
    if(userToEdit) {
        userToEdit.name = req.body.name || userToEdit.name;
        userToEdit.email = req.body.email || userToEdit.email;
        userToEdit.isAdmin = Boolean(req.body.isAdmin);
        

        const updatedUser = userToEdit.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    }else{
        res.status(404);
        throw new Error('Resource Not Found');
    }
     
});

export {authUser,registerUser,logoutUser,getUserProfile,updateUserProfile,getAllUsers,getUserById,deleteUser,updateUser};