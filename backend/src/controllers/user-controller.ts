import { Request, Response, NextFunction } from "express";
import User from "../models/User.js"
import { compare, hash } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers = async (req:Request, res:Response, next: NextFunction) => {
    try{
        const users = await User.find();
        return res.status(200).json({message: "Success", data: users});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "ERROR", because: err.message});
    }
}

export const userSignUp = async (req:Request, res:Response, next: NextFunction) => {
    try{
        const {name, email, password} = req.body;
        // console.log(name, email, password);
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(401).send({message: "User already exists"});
        const encryptedPassword = await hash(password, 10);
        const user = new User({name, email, password: encryptedPassword});
        await user.save();

        res.clearCookie(COOKIE_NAME,{
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });

        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: '/', domain: "localhost", expires, httpOnly: true, signed: true});
       
        return res.status(201).json({message: "Success", name:user.name,email:user.email});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "ERROR", because: err.message});
    }
}
export const userLogin = async (req:Request, res:Response, next: NextFunction) => {
    try{
        const {email, password} = req.body;
        // console.log(name, email, password);
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).send("User not Found");
        }
        const isPasswordCorrect = await compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(403).send("Incorrect Password");
        }

        res.clearCookie(COOKIE_NAME,{
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });

        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: '/', domain: "localhost", expires, httpOnly: true, signed: true});
        return res.status(200).json({message: "Success", name:user.name,email:user.email});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "ERROR", because: err.message});
    }
}
export const verifyUser = async (req:Request, res:Response, next: NextFunction) => {
    try{
        const user = await User.findById(res.locals.jwtData.id);
        // console.log(name, email, password);
        if(!user){
            return res.status(401).send("User not Found or Token malfunctioned");
        }
        if(user._id.toString() !== res.locals.jwtData.id){
            return res.status(401).send("Permissions didn't match"); 
        }

        return res.status(200).json({message: "Success", name:user.name,email:user.email});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "ERROR", because: err.message});
    }
}
export const userLogout = async (req:Request, res:Response, next: NextFunction) => {
    try{
        const user = await User.findById(res.locals.jwtData.id);
        // console.log(name, email, password);
        if(!user){
            return res.status(401).send("User not Found or Token malfunctioned");
        }
        if(user._id.toString() !== res.locals.jwtData.id){
            return res.status(401).send("Permissions didn't match"); 
        }

        res.clearCookie(COOKIE_NAME,{
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });

        return res.status(200).json({message: "Success", name:user.name,email:user.email});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "ERROR", because: err.message});
    }
}
