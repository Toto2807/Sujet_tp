import { Router } from "express";
import { MangaController } from "../controllers/manga.controller.js";
import { auth } from "../middlewares/auth.js";
import { requireRoles } from "../middlewares/roles.js";
import {
    handleValidationErrors,
    validateId,
} from "../middlewares/validator.js";
import { validateManga } from "../middlewares/validators/manga.validator.js";

const router = Router();

router.post(
    "/",
    auth,
    requireRoles("admin"),
    validateManga,
    handleValidationErrors,
    MangaController.create
);

router.get("/", auth, requireRoles("admin", "user"), MangaController.read);

router.get(
    "/:id",
    auth,
    requireRoles("admin", "user"),
    validateId,
    handleValidationErrors,
    MangaController.readById
);

router.put(
    "/:id",
    auth,
    requireRoles("admin"),
    validateId,
    validateManga,
    handleValidationErrors,
    MangaController.updateById
);

router.delete(
    "/:id",
    auth,
    requireRoles("admin"),
    validateId,
    handleValidationErrors,
    MangaController.deleteById
);

export default router;
