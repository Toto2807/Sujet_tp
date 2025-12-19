import { Router } from "express";
import { ChapterController } from "../controllers/chapter.controller.js";
import { auth } from "../middlewares/auth.js";
import { requireRoles } from "../middlewares/roles.js";
import {
    handleValidationErrors,
    validateId,
} from "../middlewares/validator.js";
import { validateChapter } from "../middlewares/validators/chapter.validator.js";

const router = Router();

router.post(
    "/",
    auth,
    requireRoles("admin", "user"),
    validateChapter,
    handleValidationErrors,
    ChapterController.create
);

router.get("/", auth, requireRoles("admin"), ChapterController.read);

router.get(
    "/:id",
    auth,
    requireRoles("admin"),
    validateId,
    handleValidationErrors,
    ChapterController.readById
);

router.put(
    "/:id",
    auth,
    requireRoles("admin", "user"),
    validateId,
    handleValidationErrors,
    ChapterController.updateById
);

router.delete(
    "/:id",
    auth,
    requireRoles("admin"),
    validateId,
    handleValidationErrors,
    ChapterController.deleteById
);

export default router;
