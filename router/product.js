import express, { Router } from "express"

import{addProduct,deleteProductById,getAllProducts,getProductById,updateProductById}from"../controler/product.js"

const router=Router();
router.get('/',getAllProducts);
router.get('/:id',getProductById);
router.post('/',addProduct);
router.delete('/:id',deleteProductById);
router.put('/:id',updateProductById);
export default router;