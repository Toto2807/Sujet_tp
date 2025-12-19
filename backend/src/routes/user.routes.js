import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.js";
import { requireRoles } from "../middlewares/roles.js";

const router = Router();

router.post("/", auth, requireRoles(["user"]), UserController.create);

router.get("/", auth, requireRoles(["admin"]), UserController.read);

router.get("/:id", auth, requireRoles(["admin"]), UserController.readById);

router.put("/:id", auth, requireRoles(["user"]), UserController.updateById);

router.delete("/:id", auth, requireRoles(["user"]), UserController.deleteById);

export default router;
