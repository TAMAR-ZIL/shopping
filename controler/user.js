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
        console.log("Attempting to register user:", userName);
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            console.log("User already exists:", userName);
            return res.status(400).json({ message: " משתמש כבר קיים במערכת" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ userName, email, password: hashedPassword, role });
        console.log("Saving new user:", newUser);
        await newUser.save();
        const token = generateToken(newUser);
        console.log("User registered successfully:", newUser.userName);
        res.status(201).json({ message: "נרשמת בהצלחה!", token, user: { userName: newUser.userName } });
    } catch (error) {
        console.log("there is a problem", error);
        res.status(500).json({ message: " !שגיאה בשרת" });
    }
};
export const updateUserById = async (req, res) => {
    let { id } = req.params;
    let { userName, email } = req.body;
    if (!isValidObjectId(id))
        return res.status(404).json({ title: "invalid id", message: "code isnt correct" })
    if (userName.length < 2 || email.length < 2)
        return res.status(404).json({ title: "uncorrect detail", message: "name or email is too short" })
    try {
        let user = await userModel.findByIdAndUpdate(id, { userName, email }, { new: true })
        if (!user)
            return res.status(404).json({ title: "cant update this user", message: "no such user with such code" })
        res.json(user);
    }
    catch (err) {
        res.status(400).json({ title: "cannt update user", message: err.message })
    }
}
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
export const login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        // בדיקה אם חסרים נתונים
        if (!userName || !password) {
            return res.status(400).json({ message: "יש להזין שם משתמש וסיסמה" });
        }

        console.log("Attempting login for:", userName);

        const user = await userModel.findOne({ userName: userName.trim() });

        if (!user) {
            console.log("User not found:", userName);
            return res.status(401).json({ message: "שם משתמש או סיסמה שגויים" });
        }

        console.log("User found:", user);

        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password comparison result:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: "שם משתמש או סיסמה שגויים" });
        }

        const token = generateToken(user);

        console.log("Generated Token:", token);

        res.json({ message: "התחברות הצליחה!", token, user: { userName: user.userName } });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "שגיאה בשרת" });
    }
};

// export function googleAuth(req, res) {
//     if (!req.user) {
//         return res.status(401).json({ message: "User not authenticated" });
//     }
//     const token = generateToken({
//         _id: req.user.id,
//         username: req.user.useNname,
//         role: req.user.role,
//     })
//     res.redirect(`http://localhost:5173/product?token=${token}`);
// }

// export async function getUserByToken(req, res) {
//     const token = req.header("Authorization")?.split(" ")[1];

//     if (!token) {
//         return res.status(401).json({ message: "No token provided" });
//     }

//     try {
//         const decoded = jwt.verify(token, "baby");

//         const user = await userModel.findById(decoded.userId).select("-password");
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.json(user);
//     }
//     catch (error) {
//         console.error("Token verification failed:", error);
//         res.status(401).json({ message: "Invalid token", error });
//     }
// }