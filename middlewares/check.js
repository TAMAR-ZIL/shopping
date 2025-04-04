import jwt from "jsonwebtoken"
export const checkMiddleware=(req,res,next)=>{
    let token=req.headers.authorization;
    if(!token)
        return res.status(401).json({title:"משתמש לא זוהה",message:"בצע כניסה"});
    token=token.split(" ")[1];
    try{
        let result=jwt.verify(token,process.env.TOKEN_KEY)
        next();
    }
    catch(err){
        console.log(err);
        return res.status(401).json({title:"טרם הצלחנו לאמת את זהותך",message:"בצע כניסה"})
    }    
}
export const checkManager = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token)
        return res.status(401).json({ title: "משתמש לא זוהה", message: "בצע כניסה" });
    token = token.split(" ")[1]; 
    try {
        const result = jwt.verify(token, process.env.TOKEN_KEY); 
        if (result.role === 'ADMIN') {
            return next(); 
        }
        return res.status(403).json({ title: "אין לך הרשאה", message: "רק מנהל יכול לגשת לכאן" });
    } catch (err) {
        return res.status(500).json({ title: "טרם הצלחנו לאמת את זהותך", message: "בצע כניסה" });
    }
};
