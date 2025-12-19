import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.js";
import { requireRoles } from "../middlewares/roles.js";

const router = Router();

router.post("/", auth, requireRoles(["user"]), UserController.create);

router.get("/", auth, requireRoles(["admin"]), UserController.read);

router.get("/:id", auth, requireRoles(["admin"]), UserController.readById);

router.put("/:id", auth, requireRoles(["admin"]), UserController.updateById);

router.delete("/:id", auth, requireRoles(["admin"]), UserController.deleteById);

export default router;
