import { model, Schema } from 'mongoose';
import Joi from 'joi';

const userSchema = new Schema({
    // googleId: { type: String, unique: true, sparse: true },
    userName: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "USER" }
});

export const userModel = model("User", userSchema);

const userValidationSchema = Joi.object({
    userName: Joi.string().min(3).max(30), 
    email: Joi.string().email(),  
    password: Joi.string().min(6),  
    role: Joi.string().valid('USER', 'ADMIN').default('USER')  
});

export { userValidationSchema };
