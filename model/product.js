import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    nameProduct: { type: String, required: true, minlength: 2 },
    color: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 }
}, { timestamps: true });

export const productModel = mongoose.model("Product", productSchema);