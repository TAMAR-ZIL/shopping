import {model,Schema} from "mongoose";
const productorSchema = new Schema({
    name:String,
    email:String 
})
const productSchema = new Schema({
    nameProduct: { type: String, required: true, minlength: 2 },
    description:String,
    color: { type: String, required: true },
    creationDate:{ type:Date,default:Date.now},
    productor:productorSchema,
    price: { type: Number, default:50 },
    stock: { type: Number, default:200},
    category:{type:String,default:"Home"}
});
export { productSchema };
export const productModel = model("Product", productSchema);