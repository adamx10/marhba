import { z } from "zod";

const registerSchema = z.object({
  fullName: z.string().trim().min(2, "fullName must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues[0].message;
    return res.status(400).json({ error: message });
  }

  req.body = result.data;
  next();
};

export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);