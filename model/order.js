import { Schema,model,ObjectId } from "mongoose";
import { productSchema } from "./product.js";
import Joi from "joi";

export const orderSchema=Schema({
    date:Joi.date().default(() => new Date()),
    buyingDate:Joi.date().default(() => new Date()),
    address:Joi.string().min(3).max(30),
    codeUser:{type:ObjectId,ref:"user"},
    product:productSchema,
    onWay:Joi.boolean().default(false),
    Price:Joi.number().positive().precision().required(),
    stock: Joi.number().integer().min(0).required(), 
    Delivery:Joi.boolean().default(true),

})
export const orderModel=model("order",orderSchema);
