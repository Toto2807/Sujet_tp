import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.js";
import { requireRoles } from "../middlewares/roles.js";
import { validateUser } from "../middlewares/validators/user.validator.js";

const router = Router();

router.post("/register", validateUser, AuthController.register);

router.post("/login", AuthController.login);

router.post(
    "/refresh",
    auth,
    requireRoles("admin", "user"),
    AuthController.refresh
);

router.post(
    "/logout",
    auth,
    requireRoles("admin", "user"),
    AuthController.logout
);

export default router;
