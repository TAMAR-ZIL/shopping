import { Schema,model } from "mongoose";
import Joi from "joi";

export  const userSchema=Schema({
    email:Joi.string().email(),
    userName: Joi.string().min(3).max(30),
    password:Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
    .required()
    .messages({
        "string.pattern.base": "סיסמה חייבת לכלול לפחות אות גדולה, אות קטנה, מספר ותו מיוחד",
        "string.empty": "שדה הסיסמה לא יכול להיות ריק",
        "any.required": "סיסמה היא שדה חובה"
    }),
    confirmPassword:Joi.string().valid(Joi.ref("password")).required()
}).messages({
    "any.only": "סיסמאות חייבות להיות זהות",
    role: Joi.string().default("USER"),
    })
export const userModel=model("user",userSchema);