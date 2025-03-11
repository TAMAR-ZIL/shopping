export const generateToken = (user) => {
    let token = jwt.sign(
        { userId: user._id, userName: user.userName, role: user.role },
        process.env.TOKEN_KEY,
        { expiresIn: "10m" }
    );
    return token;
}
