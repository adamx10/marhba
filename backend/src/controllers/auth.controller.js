import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js"


//hadi kansta3mloha bash ngeneritiw token 
const generateToken =(userId )=>{
    return jwt.sign({id : userId },process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRES_IN,
    });
};
// hadi bash n identifiw athentification
const sanitizeUser = (user)=>({
    id:user.id,
    fullName:user.fullName,
    email:user.email,
});
// hna ste3mlna oop bash njem3o

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
        return res.status(201).json({message:token,
            user:sanitizeUser(user),});

    }catch (error){console.error("error")};
    return res.status(500).json({message:"il ya un probleme , essayer"})
    
        }
        async login (res,req){
    try {
        const {email,password} = req.body;
        if (!email || !password){
            return res.status(400).json({message:"email et password are required"});
        }
        const normalizedEmail = email.trim().tolowerCase();
        const user = await User.findOne({
            where : { email : normalizedEmail}
        });
        if (!user){
            return res.status(401).json({messsage:"inavalid "})
        } 
        const token = generateToken(user.id);
        return res.status(200).json({token,
            user :sanitizeUser(user),
        });
        
    } catch (error) {
       console.error("login error : ",error);
       return res.status(500).json({message:"il ya un probleme , essayer encore"})
}

        
    }
    async me (req,res){
         try {
      // req.user.id khass ykon set mn middleware d authentication (verify JWT)
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user: sanitizeUser(user) });
    } catch (error) {
      console.error("Me error:", error);
      return res.status(500).json({ message: "Something went wrong, please try again" });
    }
  }
    }
export default new AuthController();
