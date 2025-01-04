import mongoose, { isValidObjectId } from "mongoose";


import{orderModel}from "../model/order.js"

export const getAllOrders=async(req,res)=>{
  try{
    let orders=await orderModel.find();
    res.json(orders);
  }
  catch(err){
    res.status(404).json({tytle:"cant find all orders",message:err.message})
  }  
}
export const addOrder=async(req,res)=>{
    let{body}=req;
    if(!body.address)
        return res.status(404).json({tytle:"address required",message:"address is missing"})
    try{
        let newOrder=new orderModel(body);
        let order=await newOrder.save();
        res.json(order)
    }
    catch(err){
        res.status(400).json({tytle:"cant add order",message:err.message})
    }
}
export const deleteOrderById=async(req,res)=>{
    let{id}=req.params;
    let {onWay}=req.body;
    if(!isValidObjectId(id))
        return res.status(404).json({tytle:"code isn't valid",message:"uncorrect code"})
    try{
        if(onWay==false)
            return id;
        let order=await orderModel.findByIdAndDelete(id);
        if(!order)
            return res.status(404).json({tytle:"cant delete order",message:"no such code"})
        res.json(order)
    }
    catch(err){
        res.status(400).json({tytle:"cant delete order with this order's code"})
    }
}
export const getByUserId=async (req,res)=>{
    let{codeUser}=req.body;
    if(!isValidObjectId(codeUser))
        return res.status(404).json({tytle:"no valid",message:"un correct user id"})
    try{
        let orders=await orderModel.find({codeUser:codeUser});
        if(!orderss)
            return res.status(404).json({tytle:"you dont have travels",message:"lets order your first travel"})
        res.json(orders)
    }
    catch(err){
        res.status(400).json({tytle:"cant show your orders",message:err.message})
    }
}
export const updateOrder=async(req,res)=>{
    let{id}=req.params;
    let{onWay}=req.body;
    if(!isValidObjectId(id))
        res.status(404).json({tytle:"not valid",message:"un correct id"})
    if(!id)
        res.status(404).json({tytle:"no such id",message:"id not found"})
    try{
        let order=await orderModel.findByIdAndUpdate(id,onWay,{new:true})
        if(!order)
            res.status(404).json({tytle:"cant update this order",message:"no such order with such id"})
        res.json(order)
    }
    catch(err){
        res.status(400).json({tytle:"cant update your order",message:err.message})
    }
}
