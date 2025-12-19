import { Router } from "express";
import { FavController } from "../controllers/fav.controller.js";
import { auth } from "../middlewares/auth.js";
import { requireRoles } from "../middlewares/roles.js";
import {
    handleValidationErrors,
    validateDoubleIds,
} from "../middlewares/validator.js";
import { validateFav } from "../middlewares/validators/fav.validator.js";

const router = Router();

router.post(
    "/",
    auth,
    requireRoles("admin"),
    validateFav,
    handleValidationErrors,
    FavController.create
);

router.get("/", auth, requireRoles("admin"), FavController.read);

router.get(
    "/:user_id/:manga_id",
    auth,
    requireRoles("admin"),
    validateDoubleIds,
    handleValidationErrors,
    FavController.readById
);

router.put(
    "/:user_id/:manga_id",
    auth,
    requireRoles("admin"),
    validateDoubleIds,
    validateFav,
    handleValidationErrors,
    FavController.updateById
);

router.delete(
    "/:user_id/:manga_id",
    auth,
    requireRoles("admin"),
    validateDoubleIds,
    handleValidationErrors,
    FavController.deleteById
);

export default router;
