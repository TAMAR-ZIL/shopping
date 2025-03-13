import mongoose, { isValidObjectId } from "mongoose";
import { productModel } from "../model/product.js"
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cloudinary from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, 
  });
  const uploadImageToCloudinary = (imageBase64) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(imageBase64, (result) => {
        if (result.error) {
          reject(result.error);
        } else {
          resolve(result.url); 
        }
      });
    });
  };
const saveImageFromBase64 = (base64Image, imageName) => {
    const filePath = path.join(__dirname, 'images', imageName);
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    fs.writeFileSync(filePath, base64Data, 'base64');
    return filePath;
};
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
export const addProduct = async (req, res) => {
    const { body, query } = req;
    let imageUrl = ''; 
  
    try {
      if (body.image) {
        imageUrl = await uploadImageToCloudinary(body.image);
      }
      const newProduct = new productModel({...body, 
        description: imageUrl || body.description, 
      });
      const product = await newProduct.save();
      const { page = 1, limit = 10 } = query;
      page = parseInt(page);
      limit = parseInt(limit);
  
      if (page < 1 || limit < 1) {
        return res.status(400).json({
          title: 'Invalid page or limit',
          message: 'Page and limit must be positive numbers',
        });
      }
      const products = await productModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit);
      
      const totalProducts = await productModel.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);
  
      res.json({ newProduct: product, products, totalProducts, totalPages, currentPage: page });
    } catch (err) {
      res.status(400).json({ title: 'cant add product', message: err.message });
    }
  };
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
export const updateProductById = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    
    if (body.description && body.description.startsWith("data:image")) {
      try {
        const uploadResponse = await cloudinary.v2.uploader.upload(body.description, {
          folder: 'product_images',  
        });
        
        body.description = uploadResponse.secure_url;  
      } catch (err) {
        return res.status(500).json({ title: "Error uploading image", message: err.message });
      }
    }
    try {
      let updatedProduct = await productModel.findByIdAndUpdate(id, body, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ title: "Product Not Found", message: "No product found with the given ID." });
      }
      return res.status(200).json({ title: "Product Updated", message: "The product was successfully updated.", product: updatedProduct });
    } catch (err) {
      return res.status(500).json({ title: "Update Failed", message: err.message });
    }
  };
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
