import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.post("/register", auth, AuthController.register);

router.post("/login", auth, AuthController.login);

router.post("/refresh", auth, AuthController.refresh);

router.post("/logout", auth, AuthController.logout);

export default router;
