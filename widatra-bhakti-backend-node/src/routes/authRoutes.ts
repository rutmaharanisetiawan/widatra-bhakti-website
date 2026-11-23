import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/admin/login", authController.adminLogin);
authRouter.post("/register", authController.registerExternal);
authRouter.post("/register/internal", authController.registerInternal);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);

// Protected routes
authRouter.use(authenticateToken);
authRouter.get("/me", authController.me);
authRouter.patch("/profile", authController.updateProfile);
authRouter.post("/change-password", authController.changePassword);
authRouter.post("/logout", authController.logout);
