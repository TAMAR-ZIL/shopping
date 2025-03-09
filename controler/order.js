import mongoose, { isValidObjectId } from "mongoose";
import Joi from "joi";

import{orderModel,orderValidationSchema}from "../model/order.js"

export const getAllOrders=async(req,res)=>{
  try{
    const {error}=orderValidationSchema.validate(req.body);
    if(error)
        return res.status(400).json({ message: error.details[0].message })
    let orders=await orderModel.find();
    res.json(orders);
  }
  catch(err){
    res.status(404).json({title:"cant find all orders",message:err.message})
  }  
}
export const addOrder=async(req,res)=>{
    let{body}=req;
    if(!body.address)
        return res.status(404).json({title:"address required",message:"address is missing"})
    try{
        let {error}=orderValidationSchema.validate(req.body)
        if(error)
            return res.status(400).json({ message: error.details[0].message })
        let newOrder=new orderModel(body);
        let order=await newOrder.save();
        res.json(order)
    }
    catch(err){
        res.status(400).json({title:"cant add order",message:err.message})
    }
}
export const deleteOrderById=async(req,res)=>{
    let {error}=orderValidationSchema.validate(req.body)
    if(error)
        return res.status(400).json({ message: error.details[0].message })
    let{id}=req.params;
    let {onWay}=req.body;
    if(!isValidObjectId(id))
        return res.status(404).json({title:"code isn't valid",message:"uncorrect code"})
    try{
        if(onWay==false)
            return id;
        let order=await orderModel.findByIdAndDelete(id);
        if(!order)
            return res.status(404).json({title:"cant delete order",message:"no such code"})
        res.json(order)
    }
    catch(err){
        res.status(400).json({title:"cant delete order with this order's code"})
    }
}
export const getByUserId=async (req,res)=>{
    let {error}=orderValidationSchema.validate(req.body)
    if(error)
        return res.status(400).json({ message: error.details[0].message })
    let{codeUser}=req.body;
    if(!isValidObjectId(codeUser))
        return res.status(404).json({title:"no valid",message:"un correct user id"})
    try{
        let orders=await orderModel.find({codeUser:codeUser});
        if(!orderss)
            return res.status(404).json({title:"you dont have travels",message:"lets order your first travel"})
        res.json(orders)
    }
    catch(err){
        res.status(400).json({title:"cant show your orders",message:err.message})
    }
}
export const updateOrder=async(req,res)=>{
    let {error}=orderValidationSchema.validate(req.body)
    if(error)
        return res.status(400).json({ message: error.details[0].message })
    let{id}=req.params;
    let{onWay}=req.body;
    if(!isValidObjectId(id))
        res.status(404).json({title:"not valid",message:"un correct id"})
    if(!id)
        res.status(404).json({title:"no such id",message:"id not found"})
    try{
        let order=await orderModel.findByIdAndUpdate(id,onWay,{new:true})
        if(!order)
            res.status(404).json({title:"cant update this order",message:"no such order with such id"})
        res.json(order)
    }
    catch(err){
        res.status(400).json({title:"cant update your order",message:err.message})
    }
}
