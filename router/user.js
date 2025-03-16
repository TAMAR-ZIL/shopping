import express, { Router } from "express";
import { checkManager, checkMiddleware } from "../middlewares/check.js";
import { getAllUsers, getUserById, login, signUp, updateUserById, updateUserPassword } from "../controler/user.js"; 
const router=Router();
router.get('/',checkManager,getAllUsers);
router.get('/:id',checkMiddleware,getUserById);
router.post('/login',login);
router.post('/signUp',signUp);
router.put('/:id',checkMiddleware,updateUserById); 
router.put('/:id/password',checkMiddleware,updateUserPassword);


export default router;
