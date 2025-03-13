import express from "express"
import dotenv from "dotenv"

import{connectDB}from"./config/DB.js"
import productRouter from "./router/product.js"
import orderRouter from "./router/order.js"
import userRouter from "./router/user.js"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url";
import {logToFile}from "./middlewares/logToFile.js"
import { log } from "console"

dotenv.config();
connectDB();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(cors());
app.get("/all",()=>{console.log("welcome");})
app.use(logToFile);
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/product',productRouter);
app.use('/api/order',orderRouter);
app.use('/api/user',userRouter);

const port = process.env.PORT 
app.listen(port,() => console.log(`Server is running on port ${port}`));

