import { Router } from "express"
import{getCategories,addProduct,deleteProductById,getAllProducts,getProductById,updateProductById,getTotalPages}from"../controler/product.js"
import { checkManager } from "../middlewares/check.js";
import { upload } from "../middlewares/upload.js";

const router=Router();
router.get('/totalPages', getTotalPages)
router.get('/getCategories',getCategories)
router.get('/',getAllProducts);
router.get('/:id',getProductById);
router.post('/',upload.single("image"),addProduct);
router.delete('/:id' ,checkManager,deleteProductById);
router.put('/:id',checkManager,upload.single("image"),updateProductById);


export default router;