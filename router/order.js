import express, { Router } from"express"

import{getEmail,addOrder,deleteOrderById,getAllOrders,getByUserId,updateOrder}from"../controler/order.js"
import { checkManager, checkMiddleware } from "../middlewares/check.js";

const router=Router();
router.get("/",checkMiddleware,getAllOrders);
router.get("/:userId",checkMiddleware,getByUserId);
router.post("/",checkMiddleware,addOrder);
router.delete("/:id",checkManager,deleteOrderById);
router.put("/:id",checkManager,updateOrder);
router.post("/getEmail",getEmail);

export default router;