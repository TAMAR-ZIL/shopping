import { model, Schema } from 'mongoose';
import { productSchema } from './product.js'; 
const orderSchema = new Schema({
    date: { type: Date, default: Date.now },
    destinationDate: { type: Date, default:() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    address: { type: String, required: true, minlength: 3, maxlength: 30 },
    codeUser: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, 
    product: productSchema, 
    onWay: { type: Boolean, default: false },
    price: { type: Number, required: true, min: 0 },
    delivery: { type: Boolean, default: true }
});

export const orderModel = model("Order", orderSchema);
