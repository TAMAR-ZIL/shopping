import express, { Router } from "express";

import{getAllUsers,getUserById,login,signUp,updateUserById,updateUserPassword}from"../controler/user.js"
import { checkManager, checkMiddleware } from "../middlewares/check.js";

const router=Router();
router.get('/',checkManager,getAllUsers);
router.get('/:id',checkMiddleware,getUserById);
router.post('/login',checkMiddleware,login);
router.post('/',checkMiddleware,signUp);
router.put('/:id',checkMiddleware,updateUserById);
router.put('/:id',checkMiddleware,updateUserPassword);

export default router;
