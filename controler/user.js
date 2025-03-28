import { isValidObjectId } from "mongoose";
import bcrypt from "bcryptjs"
import { generateToken } from "../config/generateToken.js"
import { userModel, userValidationSchema } from "../model/user.js";
import mongoose from "mongoose";

export const getAllUsers = async (req, res) => {
    try {
        let users = await userModel.find({}, { password: 0 });
        res.json(users);
    }
    catch (err) {
        res.status(404).json({ title: "cant find all users", message: err.message })
    }
}
export const getUserById = async (req, res) => {
    let { id } = req.params;
    try {
        let data = await userModel.findById(id, { password: 0 });
        if (!data)
            return res.status(404).json({ title: "invalid id", message: "no such id" })
        res.json(data);
    }
    catch (err) {
        res.status(400).json({ title: "cant get by code", message: err.message })
    }
}
export const signUp = async (req, res) => {
    let { error } = userValidationSchema.validate(req.body)
    if (error)
        return res.status(400).json({ message: error.details[0].message })
    try {
        const { userName, email, password, role } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: " משתמש כבר קיים במערכת" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ userName, email, password: hashedPassword, role });
        await newUser.save();
        const token = generateToken(newUser);
        console.log("Generated Token:", token);
        res.status(201).json({ message: "נרשמת בהצלחה!", token, user: { _id: newUser._id.toString(),email:newUser.email, userName: newUser.userName, role: newUser.role } });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: " !שגיאה בשרת" });
    }
};
export const updateUserById = async (req, res) => {
    let { id } = req.params;
    let { userName, email } = req.body;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ title: "invalid id", message: "The provided ID is not valid." });
    }
    if (!userName || userName.length < 2 || !email || email.length < 5) {
        return res.status(400).json({ title: "invalid input", message: "Username or email is too short." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ title: "invalid email", message: "The email format is incorrect." });
    }
    try {
        let user = await userModel.findByIdAndUpdate(id, { userName, email }, { new: true });

        if (!user) {
            return res.status(404).json({ title: "user not found", message: "No user found with the provided ID." });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ title: "update failed", message: err.message });
    }
};
export const updateUserPassword = async (req, res) => {
    let { id } = req.params;
    let { password } = req.body;
    if (!isValidObjectId(id))
        return res.status(404).json({ title: "invalid id", message: "code isnt correct" })
    if (password.length <= 7)
        return res.status(404).json({ title: "uncorrect detail", message: "password too short" })
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        let user = await userModel.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
        if (!user)
            return res.status(404).json({ title: "cant update this user", message: "no such user with such code" })
        res.json({ message: "Password updated successfully" });
    }
    catch (err) {
        res.status(400).json({ title: "cannt update user", message: err.message })
    }
}
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
export const login = async (req, res) => {
    try {
        const { userName, password ,captchaToken} = req.body;
        if (!captchaToken) {
            return res.status(400).json({ success: false, message: "Captcha token missing" });
        }
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: RECAPTCHA_SECRET_KEY,
                response: captchaToken
            }
        });
        if (!response.data.success) {
            return res.status(400).json({ success: false, message: "Captcha verification failed" });
        }
        if (!userName || !password) {
            return res.status(400).json({ message: "יש להזין שם משתמש וסיסמה" });
        }
        const user = await userModel.findOne({ userName: userName.trim() });
        if (!user) {
            return res.status(401).json({ message: "שם משתמש או סיסמה שגויים" });
        }
        console.log("User found:", user);
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "שם משתמש או סיסמה שגויים" });
        }
        const token = generateToken(user);
        res.json({ message: "התחברות הצליחה!", token, user: { _id: user._id.toString(), userName: user.userName, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "שגיאה בשרת" });
    }
};
export const deleteUserById=async(req,res)=>{
    let { id } = req.params;
      if (!mongoose.isValidObjectId(id))
        return res.status(404).json({ title: "code isn't valid", message: "uncorrect code" })
      try {
        let user = await userModel.findByIdAndDelete(id);
        if (!user)
          return res.status(404).json({ title: "cant delete user", message: "no such code" })
        res.json(user)
      }
      catch (err) {
        res.status(400).json({ title: "cant delete user with this user's code" })
      }
}