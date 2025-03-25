import jwt from "jsonwebtoken"
export const generateToken = (user) => {
    let token = jwt.sign(
        { userId: user._id, userName: user.userName, role: user.role },
        process.env.TOKEN_KEY,
        { expiresIn: "24h" }
    );
    return token;
}
