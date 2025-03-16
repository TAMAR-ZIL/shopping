import express, { Router } from"express"

import{addOrder,deleteOrderById,getAllOrders,getByUserId,updateOrder}from"../controler/order.js"
import { checkManager, checkMiddleware } from "../middlewares/check.js";

const router=Router();
router.get("/",checkMiddleware,getAllOrders);
router.get("/:userId",checkMiddleware,getByUserId);
router.post("/",checkMiddleware,addOrder);
router.delete("/:id",checkManager,deleteOrderById);
router.put("/:id",checkManager,updateOrder);

export default router;