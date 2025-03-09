import mongoose, { isValidObjectId } from "mongoose";

import{productModel}from"../model/product.js"
export const getAllProducts = async (req, res) => {
    try {
      const { limit = 10, page = 1 } = req.query;  
      const skip = (page - 1) * limit;  
  
      let products = await productModel.find()  
        .skip(skip)  
        .limit(parseInt(limit));  
      res.json(products);  
    } catch (err) {
      res.status(404).json({ title: "Can't find products", message: err.message });
    }
  };
  
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
    
    let{body,query}=req;
    if(!body.nameProduct||!body.color)
        return res.status(404).json({title:"product name and color required",message:"product name or color are missing"})
    if(body.nameProduct.length <= 2)
        return res.status(400).json({title:"cannt add product", massage: "name is too short"})
    try{
        let newProduct=new productModel(body);
        let product=await newProduct.save();
        let { page = 1, limit = 10 } = query;
        page = parseInt(page);
        limit = parseInt(limit);

        if (page < 1 || limit < 1) {
            return res.status(400).json({ title: "Invalid page or limit", message: "Page and limit must be positive numbers" });
        }

        const products = await productModel
            .find()
            .skip((page - 1) * limit) // דילוג על מוצרים קודמים
            .limit(limit); // מגבלת כמות מוצרים

        const totalProducts = await productModel.countDocuments(); // סה"כ מוצרים
        const totalPages = Math.ceil(totalProducts / limit); // חישוב כמות עמודים

        res.json({ newProduct, products, totalProducts, totalPages, currentPage: page });
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
export const getTotalPages = async (req, res) => {
    try {
      
        let { limit = 10 } = req.query; 
        limit = parseInt(limit);
        if (isNaN(limit) || limit < 1) {
            return res.status(400).json({ title: "Invalid limit", message: "Limit must be a positive number" });
        }
        const totalProducts = await productModel.countDocuments(); 
        const totalPages = totalProducts > 0 ? Math.ceil(totalProducts / limit) : 0; 
        res.json({ totalPages, totalProducts, limit }); 
    } catch (err) {
        res.status(500).json({ title: "Error calculating total pages", message: err.message });
    }
}
