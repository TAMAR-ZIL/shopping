import { productSchema } from "./product.js";
import Joi from 'joi';
import mongoose from 'mongoose';


const orderSchema = Joi.object({
    date: Joi.date().default(() => new Date()),
    buyingDate: Joi.date().default(() => new Date()),
    address: Joi.string().min(3).max(30).required(),
    codeUser: Joi.objectId().required(), 
    product: productSchema, 
    onWay: Joi.boolean().default(false),
    Price: Joi.number().positive().precision(2).required(),
    stock: Joi.number().integer().min(1).required(),
    Delivery: Joi.boolean().default(true),
});

const Order = mongoose.model('Order', orderSchema);

export { orderSchema, Order };

