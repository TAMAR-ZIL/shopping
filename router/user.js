import { Router } from "express";
import { checkManager, checkMiddleware } from "../middlewares/check.js";
import { deleteUserById,getAllUsers, getUserById, login, signUp, updateUserById, updateUserPassword } from "../controler/user.js"; 
const router=Router();
router.get('/',getAllUsers);
router.get('/:id',checkMiddleware,getUserById);
router.post('/login',login);
router.post('/signUp',signUp);
router.put('/:id',checkMiddleware,updateUserById); 
router.put('/:id/password',checkMiddleware,updateUserPassword);
router.delete('/:id',deleteUserById);


export default router;
