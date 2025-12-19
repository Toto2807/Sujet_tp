import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.post("/refresh", auth, AuthController.refresh);

router.post("/logout", auth, AuthController.logout);

export default router;
