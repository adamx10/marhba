import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js"


//hadi kansta3mloha bash ngeneritiw token 
const generateToken =(userId )=>{
    return jwt.sign({id : userId },process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRES_IN,
    });
};
const sanitizeUser = (user)=>({
    id:user.id,
    fullName:user.fullName,
    email:user.email,
});
class AuthController {
    async register (req,res){
        const { fullName, email, password } = req.body;
        if(!fullName || !email || !password){
            return res.status (400).json({message:"fullName, email and password are required"})
        }
        if (password.length < 6){
            return res.status(201)
        }
    }
}
