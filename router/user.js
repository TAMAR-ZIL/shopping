import express, { Router } from "express";
import { checkManager, checkMiddleware } from "../middlewares/check.js";
import { getAllUsers, getUserById, login, signUp, updateUserById, updateUserPassword } from "../controler/user.js"; 
const router=Router();
router.get('/',getAllUsers);
// ,checkManager
router.get('/:id',getUserById);
// ,checkMiddleware
router.post('/login',login);
router.post('/signUp',signUp);
router.put('/:id',updateUserById);
// ,checkMiddleware
router.put('/:id/password',updateUserPassword);
// checkMiddleware,

export default router;
