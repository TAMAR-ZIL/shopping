import {model,Schema}from "mongoose"
const orderSchema = new Schema({
    date: { type: Date, default: Date.now },
    buyingDate: { type: Date, default: Date.now },
    address: { type: String, required: true, minlength: 3, maxlength: 30 },
    codeUser: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, // חיבור למודל משתמש
    product: { type: productSchema, required: true }, // חיבור למודל Mongoose של מוצר
    onWay: { type: Boolean, default: false },
    Price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 1 },
    Delivery: { type: Boolean, default: true }
});
export const orderModel=model("Order",orderSchema)