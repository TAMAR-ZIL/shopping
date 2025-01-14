import mongoose, { isValidObjectId } from "mongoose";


import{productModel}from"../model/product.js"

export const getAllProducts=async(req,res)=>{
  try{
    let products=await productModel.find();
    res.json(products);
  }
  catch(err){
    res.status(404).json({title:"cant find all products",message:err.message})
  }  
}
export const getProductById=async(req,res)=>{
    let {id}=req.params;
    if(!isValidObjectId(id))
        return res.status(404).json({title:"invalid code",message:"this is not a correct code"})
    try{
      let code=await productModel.findById(id);
      res.json(code);
    }
    catch(err){
      res.status(400).json({tytle:"cant get by code",message:err.message})
    }  
}
export const addProduct=async(req,res)=>{
    let{body}=req;
    if(!body.nameProduct||!body.color)
        return res.status(404).json({title:"product name and color required",message:"product name or color are missing"})
    if(body.nameProduct.length <= 2)
        return res.status(400).json({title:"cannt add product", massage: "name is too short"})
    try{
        let newProduct=new productModel(body);
        let product=await newProduct.save();
        res.json(product)
    }
    catch(err){
        res.status(400).json({title:"cant add product",message:err.message})
    }
}
export const deleteProductById=async(req,res)=>{
    let{id}=req.params;
    if(!mongoose.isValidObjectId(id))
        return res.status(404).json({title:"code isn't valid",message:"uncorrect code"})
    try{
        let product=await productModel.findByIdAndDelete(id);
        if(!product)
            return res.status(404).json({title:"cant delete product",message:"no such code"})
        res.json(product)
    }
    catch(err){
        res.status(400).json({tytle:"cant delete product with this product's code"})
    }
}
export const updateProductById=async (req,res)=>{
    let{id}=req.params;
    let{body}=req;
    if(!isValidObjectId||!body)
        return res.status(404).json({title:"invalid details",message:"code isnt correct or no such product"})
    if(body.nameProduct.length<2)
        return res.status(404).json({title:"uncorrect detail",message:"name is too short"})
    try{
        let product=await productModel.findByIdAndUpdate(id,body,{new:true})
        if(!product)
            return res.status(404).json({title:"cant update this product",message:"no such product with such code"})
    }
    catch(err){
        res.status(400).json({title:"cannt update product",message:err.massage})
    }
}


