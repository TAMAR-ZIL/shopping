import express, { Router } from"express"

import{addOrder,deleteOrderById,getAllOrders,getByUserId,updateOrder}from"../controler/order.js"
import { checkManager, checkMiddleware } from "../middlewares/check.js";

const router=Router();
router.get("/",getAllOrders);
// checkMiddleware,
router.get("/:userId",getByUserId);
// ,checkMiddleware
router.post("/",addOrder);
// checkMiddleware,
router.delete("/:id",deleteOrderById);
// checkManager,
router.put("/:id",updateOrder);
// ,checkManager

export default router;