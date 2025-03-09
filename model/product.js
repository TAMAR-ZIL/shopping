import {model,Schema} from "mongoose";
const productSchema = new Schema({
    nameProduct: { type: String, required: true, minlength: 2 },
    color: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 }
}, { timestamps: true });
export { productSchema };
export const productModel = model("Product", productSchema);