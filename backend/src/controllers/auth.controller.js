import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sanitizeUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
});

class AuthController {
  async register(req, res) {
    try {
      const { fullName, email, password } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
      });

      const token = generateToken(user.id);

      return res.status(201).json({
        token,
        user: sanitizeUser(user),
      });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({ error: "Something went wrong, please try again" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Email ou mot de passe incorrect" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Email ou mot de passe incorrect" });
      }

      const token = generateToken(user.id);

      return res.status(200).json({
        token,
        user: sanitizeUser(user),
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Something went wrong, please try again" });
    }
  }

  async me(req, res) {
    try {
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ user: sanitizeUser(user) });
    } catch (error) {
      console.error("Me error:", error);
      return res.status(500).json({ error: "Something went wrong, please try again" });
    }
  }
}

export default new AuthController();