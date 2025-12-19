import { Router } from "express";
import { ChapterController } from "../controllers/chapter.controller.js";
import { auth } from "../middlewares/auth.js";
import { requireRoles } from "../middlewares/roles.js";

const router = Router();

router.post("/", auth, requireRoles(["user"]), ChapterController.create);

router.get("/", auth, requireRoles(["admin"]), ChapterController.read);

router.get("/:id", auth, requireRoles(["admin"]), ChapterController.readById);

router.put("/:id", auth, requireRoles(["user"]), ChapterController.updateById);

router.delete(
    "/:id",
    auth,
    requireRoles(["user"]),
    ChapterController.deleteById
);

export default router;
