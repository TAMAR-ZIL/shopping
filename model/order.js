import { Schema,model,ObjectId } from "mongoose";
import { productSchema } from "./product.js";

export const orderSchema=Schema({
    date:{type:Date,default:new Date()},
    buyingDate:{type:Date,default:new Date()},
    address:String,
    codeUser:{type:ObjectId,ref:"user"},
    product:productSchema,
    onWay:Boolean,
    Price:Number,
    Delivery:{type:Number,default:20},

})
export const orderModel=model("order",orderSchema);
