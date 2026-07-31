import z from "zod";
const registerSchema = z.object({
    fullName : z.string().min(6,"password must be at least 6 characteres "),
});
const loginSchema = z.object({
    email:z.string().trim().tolowerCase().email("ivalide email format"),
    password:z.string().min(1,"password is required "),
});
const valide = (schema)=>(req,res,next)=>{
    const result =schema.safeParse(req.body);
    if (!result.success){
        const message =result.error.issues[0].message;
        return res.status(400).json({message});
    }
    req.body = result.data;
    next ();
};
export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);