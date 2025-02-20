import express, { Router } from "express"

import{addProduct,deleteProductById,getAllProducts,getProductById,updateProductById,getTotalPages}from"../controler/product.js"

const router=Router();
router.get('/totalPages', getTotalPages)
router.get('/',getAllProducts);
router.get('/:id',getProductById);
router.post('/',addProduct);
router.delete('/:id',deleteProductById);
router.put('/:id',updateProductById);

export default router;