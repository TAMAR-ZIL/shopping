import { model, Schema } from 'mongoose';
import Joi from 'joi';

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true, minlength: 3, maxlength: 30 },
    password: { type: String, required: true },
    role: { type: String, default: "USER" }
});

export const userModel = model("User", userSchema);

const userValidationSchema = Joi.object({
    email: Joi.string().email(),  
    userName: Joi.string().min(3).max(30).required(),  
    password: Joi.string().min(6).required(),  
    role: Joi.string().valid('USER', 'ADMIN').default('USER')  
});

export { userValidationSchema };
