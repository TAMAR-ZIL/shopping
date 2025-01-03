import express, { Router } from"express"

import{addOrder,deleteOrderById,getAllOrders,getByUserId,updateOrder}from"../controler/order.js"

const router=Router();
router.get("/",getAllOrders);
router.get("/:userId",getByUserId);
router.post("/",addOrder);
router.delete("/:id",deleteOrderById);
router.put("/:id",updateOrder);

export default router;