import express from "express"
import dotenv from "dotenv"

import{connectDB}from"./config/DB.js"
import productRouter from "./router/product.js"
import orderRouter from "./router/order.js"
import userRouter from "./router/user.js"
import cors from "cors"


dotenv.config();
connectDB();
const express = require('express');
const app = express();
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(cors());
app.use(express.json());
app.use('/api/product',productRouter);
app.use('/api/order',orderRouter);
app.use('/api/user',userRouter);

const port = process.env.PORT 
app.listen(port,() => console.log(`Server is running on port ${port}`));

