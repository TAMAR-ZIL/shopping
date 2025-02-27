import express, { Router } from "express"

import{addProduct,deleteProductById,getAllProducts,getProductById,updateProductById,getTotalPages}from"../controler/product.js"
import { checkManager } from "../middlewares/check.js";

const router=Router();
router.get('/totalPages', getTotalPages)
router.get('/',getAllProducts);
router.get('/:id',getProductById);
router.post('/',checkManager,addProduct);
router.delete('/:id',checkManager,deleteProductById);
router.put('/:id',checkManager,updateProductById);

export default router;