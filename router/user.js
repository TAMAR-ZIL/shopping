import express, { Router } from "express";

import{getAllUsers,getUserById,login,signUp,updateUserById,updateUserPassword}from"../controler/user.js"

const router=Router();
router.get('/',getAllUsers);
router.get('/:id',getUserById);
router.post('/:id/:password',login);
router.post('/',signUp);
router.put('/:id',updateUserById);
router.put('/:id',updateUserPassword);

export default router;
