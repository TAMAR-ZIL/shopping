import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/generateToken.js";
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true, minlength: 3, maxlength: 30 },
    password: { type: String, required: true },
    role: { type: String, default: "USER" }
}, { timestamps: true });

export const UserModel = mongoose.model("User", userSchema);
