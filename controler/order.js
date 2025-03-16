import  { isValidObjectId } from "mongoose";

import { orderModel } from "../model/order.js"

export const getAllOrders = async (req, res) => {
    try {
        let orders = await orderModel.find();
        res.json(orders);
    }
    catch (err) {
        res.status(404).json({ title: "cant find all orders", message: err.message })
    }
}
export const addOrder = async (req, res) => {
    let { body } = req;
    if (!body.address)
        return res.status(404).json({ title: "address required", message: "address is missing" })
    try {
        let newOrder = new orderModel(body);
        let order = await newOrder.save();
        res.json(order)
    }
    catch (err) {
        res.status(400).json({ title: "cant add order", message: err.message })
    }
}
export const deleteOrderById = async (req, res) => {
    let { id } = req.params;
    if (!isValidObjectId(id))
        return res.status(404).json({ title: "code isn't valid", message: "uncorrect code" })
    try {
        let order = await orderModel.findById(id);
        if (!order) return res.status(404).json({ title: "cant delete order", message: "no such order" });
        if (order.onWay) return res.status(400).json({ title: "cant delete", message: "order is on the way" });
        let deletedOrder = await orderModel.findByIdAndDelete(id);
        res.json(deletedOrder);
    }
    catch (err) {
        res.status(400).json({ title: "cant delete order with this order's code" })
    }
}
export const getByUserId = async (req, res) => {
    let {userId}=req.params;
    if (!isValidObjectId(userId))
        return res.status(404).json({ title: "no valid", message: "un correct user id" })
    try {
        let orders = await orderModel.find({ codeUser: userId });
        if (!orders)
            return res.status(404).json({ title: "you dont have travels", message: "lets order your first travel" })
        res.json(orders)
    }
    catch (err) {
        res.status(400).json({ title: "cant show your orders", message: err.message })
    }
}
export const updateOrder = async (req, res) => {
    let { id } = req.params;
    let { onWay } = req.body;
    if (!isValidObjectId(id))
        res.status(404).json({ title: "not valid", message: "un correct id" })
    if (!id)
        res.status(404).json({ title: "no such id", message: "id not found" })
    try {
        let order = await orderModel.findByIdAndUpdate(id, { onWay }, { new: true });
        if (!order)
            res.status(404).json({ title: "cant update this order", message: "no such order with such id" })
        res.json(order)
    }
    catch (err) {
        res.status(400).json({ title: "cant update your order", message: err.message })
    }
}
