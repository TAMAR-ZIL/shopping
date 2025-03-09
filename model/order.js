import { productSchema } from "./product.js";
import Joi from 'joi'; 
import { Schema, model } from 'mongoose'; 

const orderSchema = new Schema({
    date: { type: Date, default: Date.now },
    buyingDate: { type: Date, default: Date.now },
    address: { type: String, required: true, minlength: 3, maxlength: 30 },
    codeUser: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, 
    product: { type: productSchema, required: true }, 
    onWay: { type: Boolean, default: false },
    Price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 1 },
    Delivery: { type: Boolean, default: true }
});

const orderModel = model('Order', orderSchema);

const orderValidationSchema = Joi.object({
    date: Joi.date().default(() => new Date()),
    buyingDate: Joi.date().default(() => new Date()),
    address: Joi.string().min(3).max(30).required(),
    codeUser: Joi.required(),  
    product: Joi.object().required(), 
    onWay: Joi.boolean().default(false),
    Price: Joi.number().positive().precision(2).required(),
    stock: Joi.number().integer().min(1).required(),
    Delivery: Joi.boolean().default(true),
});

export { orderValidationSchema, orderModel };
