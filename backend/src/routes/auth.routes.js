import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import authenticate from "../middlewares/authenticate.middleware.js";
import { validateRegister, validateLogin } from "../middlewares/validation.middleware.js";

const router = Router();

router.post("/register", validateRegister, AuthController.register);
router.post("/login", validateLogin, AuthController.login);
router.get("/me", authenticate, AuthController.me);

export default router;