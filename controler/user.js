import mongoose ,{isValidObjectId}from "mongoose";
import bcrypt from "bcryptjs"

import {userModel}from"../model/user.js"

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
export const signUp=async(req,res)=>{
    let{body}=req;
    if(!body.userName||!body.email||!body.password)
        return res.status(404).json({title:"details required",message:"missing details"})
    if(body.userName.length <= 2)
        return res.status(400).json({title:"cannt sign", massage: "name is too short"})
    if(body.password.length <= 7)
        return res.status(400).json({title:"minimum 8 characters", massage: "password is too short"})

    try{
        let newUser=new userModel(body);
        let user=await newUser.save();
        res.json(user)
    }
    catch(err){
        res.status(400).json({title:"cant sign up",message:err.message})
    }
}
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
    let {userName,password}=req.body;
    if(!isValidObjectId(id))
        return res.status(404).json({title:"invalid code",message:"this is not a correct code"})
    const user = await userModel.findOne({ userName: userName });
    if (!user) 
        return res.status(404).json({ title: "User not found", message: "No user found with this ID" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
         return res.status(401).json({ title: "Login failed", message: "Incorrect password" });
    res.json({ message: "Login successful!", user: { id: user._id, userName: user.userName, email: user.email } });
    } 
    catch (err) {
        res.status(500).json({ title: "Server error", message: err.message });
    }
}


