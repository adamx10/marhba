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
        try{
             const { fullName, email, password } = req.body;
        if(!fullName || !email || !password){
            return res.status (400).json({message:"fullName, email and password are required"})
        }
        if (password.length < 6){
            return res.status(400).json({message:"password must be at least 6 characters "})

        }
        const normalizedEmail =  email.trim().tolowerCase();
        const existingUser = await User.findAll({ where :{email:normalizedEmail}});
        if (existingUser) {
            return res.status(400).json({message:"email deja utilisé"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            fullName:fullName.trim(),
            email:normalizedEmail,
            password:hashedPassword
        });
        const token = generateToken(user.id);
        return res.status

    }catch (error){console.log("error")}
    
        }
        
       
}
