import { Router } from "express";
import { FavController } from "../controllers/fav.controller.js";
import { auth } from "../middlewares/auth.js";
import { requireRoles } from "../middlewares/roles.js";

const router = Router();

router.post("/", auth, requireRoles(["admin"]), FavController.create);

router.get("/", auth, requireRoles(["admin"]), FavController.read);

router.get("/:id", auth, requireRoles(["admin"]), FavController.readById);

router.put("/:id", auth, requireRoles(["admin"]), FavController.updateById);

router.delete("/:id", auth, requireRoles(["admin"]), FavController.deleteById);

export default router;
