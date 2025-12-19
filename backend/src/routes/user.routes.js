import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.js";
import { requireRoles } from "../middlewares/roles.js";
import { validateUser } from "../middlewares/validators/user.validator.js";
import {
    handleValidationErrors,
    validateId,
} from "../middlewares/validator.js";

const router = Router();

router.post(
    "/",
    auth,
    requireRoles("admin"),
    validateUser,
    handleValidationErrors,
    UserController.create
);

router.get("/", auth, requireRoles("admin"), UserController.read);

router.get(
    "/:id",
    auth,
    requireRoles("admin"),
    validateId,
    handleValidationErrors,
    UserController.readById
);

router.put(
    "/:id",
    auth,
    requireRoles("admin"),
    validateUser,
    validateId,
    handleValidationErrors,
    UserController.updateById
);

router.delete(
    "/:id",
    auth,
    requireRoles("admin"),
    validateId,
    handleValidationErrors,
    UserController.deleteById
);

export default router;
