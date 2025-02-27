import jwt from "jsonwebtoken"
export const checkMiddleware=(req,res,next)=>{
    let token=req.headers.authorization;
    if(!token)
        return res.status(401).json({title:"משתמש לא זוהה",message:"בצע כניסה"});
    token=token.split(" ")[1];
    try{
        let result=jwt.verify(token,process.env.TOKEN_KEY)
        console.log(result);
        next();
    }
    catch(err){
        log(err)
        return res.status.json({title:"טרם הצלחנו לאמת את זהותך",message:"בצע כניסה"})
    }
}
export const checkManager=()=>{
   let token=req.headers.authorization;
   if(!token)
     return res.status.json({title:"משתמש לא זוהה",message:"בצע כניסה"}) 
   token=token.split(" "[1])
   try{
    let result=jwt.verify(token,process.env.TOKEN_KEY)
    if(result.role=='MANAGER')
        next();
    return res.status(403).json({title:"אין לך הרשאה",message:"רק מנהל יכול לגשת לכאן"})
   }
   catch(err){
    console.log(err);
    return res.status.json({title:"טרם הצלחנו לאמת את זהותך",message:"בצע כניסה"})
    
   }
}