import { Router } from "express";
import { MangaController } from "../controllers/manga.controller.js";
import { auth } from "../middlewares/auth.js";
import { requireRoles } from "../middlewares/roles.js";

const router = Router();

router.post("/", auth, requireRoles(["admin"]), MangaController.create);

router.get("/", auth, requireRoles(["user"]), MangaController.read);

router.get("/:id", auth, requireRoles(["user"]), MangaController.readById);

router.put("/:id", auth, requireRoles(["admin"]), MangaController.updateById);

router.delete(
    "/:id",
    auth,
    requireRoles(["admin"]),
    MangaController.deleteById
);

export default router;
