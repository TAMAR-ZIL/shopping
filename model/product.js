import { Schema,model } from "mongoose";
export const productorSchema=Schema({
    name:String,
    phone:String,
    email:String
})

export const productSchema=Schema({
nameProduct:String,
description:String,
color:String,
creationDate:{type:Date,default:new Date()},
productor:productorSchema
})
export const productModel=model("product",productSchema)