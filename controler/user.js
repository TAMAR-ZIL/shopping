import mongoose ,{isValidObjectId}from "mongoose";
import bcrypt from "bcryptjs"
import{generateToken}from "../config/generateToken.js"


import { userModel } from "../model/user.js";


export const getAllUsers=async(req,res)=>{
  try{
    let users=await userModel.find({},{password:0});
    res.json(users);
  }
  catch(err){
    res.status(404).json({title:"cant find all users",message:err.message})
  }  
}
export const getUserById=async(req,res)=>{
    let {id}=req.params;
    if(!isValidObjectId(id))
        return res.status(404).json({title:"invalid code",message:"this is not a correct code"})
    try{
      let data=await userModel.findById(id,{password:0});
      if(!data)
        return res.status(404).json({title:"invalid id",message:"no such id"})
      res.json(data);
    }
    catch(err){
      res.status(400).json({title:"cant get by code",message:err.message})
    }  
}

export const signUp = async (req, res) => {
    try {
        const { email, userName, password } = req.body;
        if (!userName || !email || !password) {
            return res.status(400).json({ title: "Details required", message: "Missing details" });
        }
        if (userName.length <= 2) {
            return res.status(400).json({ title: "Cannot sign up", message: "Name is too short" });
        }
        if (password.length <= 7) {
            return res.status(400).json({ title: "Minimum 8 characters", message: "Password is too short" });
        }
        const existingUser = await userModel.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ title: "Registration failed", message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({ email, userName, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json({ message: "User registered successfully!", user: { id: savedUser._id, email, userName } });
    } catch (err) {
        res.status(500).json({ title: "Server error", message: err.message });
    }
};

export const updateUserById=async (req,res)=>{
    let{id}=req.params;
    let{userName,email}=req.body;
    if(!isValidObjectId)
        return res.status(404).json({title:"invalid id",message:"code isnt correct"})
    if(userName.length<2||email.length<2)
        return res.status(404).json({title:"uncorrect detail",message:"name or email is too short"})
    try{
        let user=await userModel.findByIdAndUpdate(id,userName,email,{new:true})
        if(!user)
            return res.status(404).json({title:"cant update this user",message:"no such user with such code"})
    }
    catch(err){
        res.status(400).json({title:"cannt update user",message:err.massage})
    }
}

export const updateUserPassword=async (req,res)=>{
    let{id}=req.params;
    let{password}=req.body;
    if(!isValidObjectId)
        return res.status(404).json({title:"invalid id",message:"code isnt correct"})
    if(password.length<=7)
        return res.status(404).json({title:"uncorrect detail",message:"password too short"})
    try{
        let user=await userModel.findByIdAndUpdate(id,password,{new:true})
        if(!user)
            return res.status(404).json({title:"cant update this user",message:"no such user with such code"})
    }
    catch(err){
        res.status(400).json({title:"cannt update user",message:err.massage})
    }
}
export const login=async(req,res)=>{
    try{
    let {body}=req;
    const user = await userModel.findOne({ userName: body.userName }).lean();
    if (!user) 
        return res.status(404).json({ title: "User not found", message: "No user found with this ID" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
         return res.status(401).json({ title: "Login failed", message: "Incorrect password" });
    let {password,...data}=user;
    let t=generateToken(data);
        res.json({...data,token:t});
    } 
    catch (err) {
        res.status(500).json({ title: "Server error", message: err.message });
    }
}


