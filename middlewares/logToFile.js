import{appendFile}from "fs/promises"


export const logToFile=(req,res,next)=>{
 appendFile("log1.txt",`\n${new Date().toLocaleString()}------->${req.method}${req.url}`);
 next();
}