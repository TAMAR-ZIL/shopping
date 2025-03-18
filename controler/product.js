import mongoose, { isValidObjectId } from "mongoose";
import { productModel } from "../model/product.js"
import CategoriesEnum from"../utils/categoriesEnum.js"

export const getCategories = async(req,res)=>{
  try {
    const categories = CategoriesEnum; 
    res.json(categories);
  } catch (err) {
    res.status(500).json({ title: "Error fetching categories", message: err.message });
  }
}
export const getAllProducts = async (req, res) => {
  const { category,search,minPrice,maxPrice,limit = 10, page = 1, } = req.query;
  let filter = {};
  if (category && category !== "ALL") {
    filter.category = category;
  }
  if(search){
    filter.nameProduct={$regex:search,$options:"i"};
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }
  try {
    const skip = (page - 1) * limit;
    let products = await productModel.find(filter).skip(skip).limit(parseInt(limit));
    res.json(products);
  } catch (err) {
    res.status(404).json({ title: "Can't find products", message: err.message });
  }
};

export const getProductById = async (req, res) => {
  let { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(404).json({ title: "invalid code", message: "this is not a correct code" })
  try {
    let code = await productModel.findById(id);
    res.json(code);
  }
  catch (err) {
    res.status(400).json({ tytle: "cant get by code", message: err.message })
  }
}

export const deleteProductById = async (req, res) => {
  let { id } = req.params;
  if (!mongoose.isValidObjectId(id))
    return res.status(404).json({ title: "code isn't valid", message: "uncorrect code" })
  try {
    let product = await productModel.findByIdAndDelete(id);
    if (!product)
      return res.status(404).json({ title: "cant delete product", message: "no such code" })
    res.json(product)
  }
  catch (err) {
    res.status(400).json({ tytle: "cant delete product with this product's code" })
  }
}
export const getTotalPages = async (req, res) => {
  try {
    let { limit = 10, category, search, minPrice, maxPrice } = req.query;
    limit = parseInt(limit);
    let filter = {};
    if (category&&category!="ALL") filter.category = category;
    if (search) filter.nameProduct = { $regex: search, $options: "i" };
    if (minPrice) filter.price = { $gte: minPrice };
    if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice };
    const totalProducts = await productModel.countDocuments(filter);
    const totalPages = totalProducts > 0 ? Math.ceil(totalProducts / limit) : 0;
    res.json({ totalPages, totalProducts, limit });
  } 
  catch (err) {
    res.status(500).json({ title: "Error calculating total pages", message: err.message });
  }
};
export const addProduct = async (req, res) => { 
  try {
    console.log("🔥 קובץ שהתקבל:", req.file);  // בדיקה אם הקובץ הגיע  
    console.log("📦 Body:", req.body);
    const { nameProduct, color, price, stock, category } = req.body;
    
    let imageUrl = req.file ? `/images/${req.file.filename}` : "/images/default.jpg";

    const newProduct = new productModel({
      nameProduct,
      description: imageUrl, 
      color,
      price,
      stock,
      category
    });

    await newProduct.save();
    const totalProducts = await productModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / 10);
    
    res.status(201).json({ newProduct, totalProducts, totalPages });
  } catch (err) {
    res.status(500).json({ title: "Error adding product", message: err.message });
  }
};

export const updateProductById = async (req, res) => {
  let { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(404).json({ title: "Invalid product ID", message: "This is not a correct ID" });
  try {
    const { nameProduct, description, color, price, stock, category } = req.body;
    let updateData = { nameProduct, description, color, price, stock, category };
    if (req.file) {
      updateData.description = `/images/${req.file.filename}`||description;
    }
    const updatedProduct = await productModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct)
      return res.status(404).json({ title: "Product not found", message: "No product with this ID" });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ title: "Error updating product", message: err.message });
  }
};


