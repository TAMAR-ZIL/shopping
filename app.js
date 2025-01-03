import express from "express"
import dotenv from "dotenv"

import{connectDB}from"./config/DB.js"
import productRouter from "./router/product.js"
import orderRouter from "./router/order.js"
import userRouter from "./router/user.js"


dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use('api/product',productRouter);
app.use('api/order',orderRouter);
app.use('api/user',userRouter);

const port = process.env.PORT 
app.listen(port,() => console.log(`Server is running on port ${port}`));

