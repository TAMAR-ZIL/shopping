import mongoose, { isValidObjectId } from "mongoose";
import { productModel } from "../model/product.js"
import path from 'path';

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
    let { body, query } = req;
    if (!body.nameProduct || !body.color)
        return res.status(404).json({ title: "product name and color required", message: "product name or color are missing" });
    if (body.nameProduct.length <= 2)
        return res.status(400).json({ title: "cannt add product", message: "name is too short" });
    try {
        let imagePath = '';
        if (body.description && body.description.startsWith('data:image/')) {
            const imageName = `${Date.now()}.png`;
            imagePath = saveImageFromBase64(body.description, imageName);
        }
        let newProduct = new productModel({
            ...body,
            description: imagePath ? imagePath : '',
        });
        let product = await newProduct.save();
        let { page = 1, limit = 10 } = query;
        page = parseInt(page);
        limit = parseInt(limit);

        if (page < 1 || limit < 1) {
            return res.status(400).json({ title: "Invalid page or limit", message: "Page and limit must be positive numbers" });
        }

        const products = await productModel.find().skip((page - 1) * limit).limit(limit);
        const totalProducts = await productModel.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);
        res.json({ newProduct, products, totalProducts, totalPages, currentPage: page });
    }
    catch (err) {
        res.status(400).json({ title: "cant add product", message: err.message });
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
    let { id } = req.params;
    let { body } = req;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ title: "Invalid ID", message: "The provided product ID is not valid." });
    }
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ title: "Invalid Data", message: "Request body is missing or empty." });
    }
    if (body.nameProduct && body.nameProduct.length < 2) {
        return res.status(400).json({ title: "Invalid Name", message: "Product name is too short." });
    }
    try {
        let imagePath = body.description;
        if (body.description && body.description.startsWith('data:image/')) {
            const imageName = `${Date.now()}.png`;
            imagePath = saveImageFromBase64(body.description, imageName);
        }
        let updatedProduct = await productModel.findByIdAndUpdate(id, { ...body, description: imagePath }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ title: "Product Not Found", message: "No product found with the given ID." });
        }
        return res.status(200).json({ title: "Product Updated", message: "The product was successfully updated.", product: updatedProduct });
    } catch (err) {
        return res.status(500).json({ title: "Update Failed", message: err.message });
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
