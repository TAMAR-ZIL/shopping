import express, { Router } from "express"

import{addProduct,deleteProductById,getAllProducts,getProductById,updateProductById,getTotalPages}from"../controler/product.js"
import { checkManager } from "../middlewares/check.js";

const router=Router();
router.get('/totalPages', getTotalPages)
router.get('/',getAllProducts);
router.get('/:id',getProductById);
router.post('/',addProduct);
// ,checkManager
router.delete('/:id',deleteProductById);
// ,checkManager
router.put('/:id',updateProductById);
// ,checkManager

export default router;