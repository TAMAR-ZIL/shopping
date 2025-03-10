import { isValidObjectId } from "mongoose";
import bcrypt from "bcryptjs"
import { generateToken } from "../config/generateToken.js"
import { userModel, userValidationSchema } from "../model/user.js";


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
    if (!isValidObjectId(id))
        return res.status(404).json({ title: "invalid code", message: "this is not a correct code" })
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
        const { userName, password } = req.body;
        const existingUser = await userModel.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: "שם משתמש כבר קיים במערכת" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ userName, password: hashedPassword });
        await newUser.save();
        const token = generateToken(newUser._id);
        res.status(201).json({ message: "נרשמת בהצלחה!", token, user: { userName: newUser.userName } });
    } catch (error) {
        res.status(500).json({ message: "שגיאה בשרת", error });
    }
};

export const updateUserById = async (req, res) => {
    let { error } = userValidationSchema.validate(req.body)
    if (error)
        return res.status(400).json({ message: error.details[0].message })
    let { id } = req.params;
    let { userName, email } = req.body;
    if (!isValidObjectId)
        return res.status(404).json({ title: "invalid id", message: "code isnt correct" })
    if (userName.length < 2 || email.length < 2)
        return res.status(404).json({ title: "uncorrect detail", message: "name or email is too short" })
    try {
        let user = await userModel.findByIdAndUpdate(id, userName, email, { new: true })
        if (!user)
            return res.status(404).json({ title: "cant update this user", message: "no such user with such code" })
    }
    catch (err) {
        res.status(400).json({ title: "cannt update user", message: err.massage })
    }
}

export const updateUserPassword = async (req, res) => {
    let { error } = userValidationSchema.validate(req.body)
    if (error)
        return res.status(400).json({ message: error.details[0].message })
    let { id } = req.params;
    let { password } = req.body;
    if (!isValidObjectId)
        return res.status(404).json({ title: "invalid id", message: "code isnt correct" })
    if (password.length <= 7)
        return res.status(404).json({ title: "uncorrect detail", message: "password too short" })
    try {
        let user = await userModel.findByIdAndUpdate(id, password, { new: true })
        if (!user)
            return res.status(404).json({ title: "cant update this user", message: "no such user with such code" })
    }
    catch (err) {
        res.status(400).json({ title: "cannt update user", message: err.massage })
    }
}
export const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await userModel.findOne({ userName });
        if (!user) {
            return res.status(401).json({ message: "שם משתמש או סיסמה שגויים" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "שם משתמש או סיסמה שגויים" });
        }
        const token = generateToken(user._id);

        res.json({ message: "התחברות הצליחה!", token, user: { userName: user.userName } });
    } catch (error) {
        res.status(500).json({ message: "שגיאה בשרת", error });
    }
}


