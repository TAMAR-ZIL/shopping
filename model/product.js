import { Schema,model } from "mongoose";
import Joi, { string } from "joi";
export const productorSchema=Schema({
    name:Joi.string(3).min().max(30),
    phone:Joi.string().min(9).max(10),
    email:Joi.string().email()
})

export const productSchema=Schema({
nameProduct:Joi.string().min(3).max(30),
description:Joi.string().max(50),
color:Joi.string(),
price:Joi.number().positive().precision().required(),
creationDate:Joi.date().required(),
productor:productorSchema
})
export const productModel=model("product",productSchema)