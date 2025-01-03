import { Schema,model } from "mongoose";

const userSchema=Schema({
    email:String,
    userName:String,
    password:String,
    role:{type:String ,default:"user"},
    date:{type:Date,default:new Date()}
})
export const userModel=model("user",userSchema);