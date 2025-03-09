import {model,Schema} from "mongoose";
const userSchema = Schema({
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true, minlength: 3, maxlength: 30 },
    password: { type: String, required: true },
    role: { type: String, default: "USER" }
}, { timestamps: true });

export const userModel = model("User", userSchema);
