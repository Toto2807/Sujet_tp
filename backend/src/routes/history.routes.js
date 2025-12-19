import { Router } from "express";
import { HistoryController } from "../controllers/history.controller.js";
import { auth } from "../middlewares/auth.js";
import { requireRoles } from "../middlewares/roles.js";
import {
    handleValidationErrors,
    validateId,
    validateDoubleIds,
} from "../middlewares/validator.js";
import { validateHistory } from "../middlewares/validators/history.validator.js";

const router = Router();

router.post(
    "/",
    auth,
    requireRoles("admin"),
    validateHistory,
    handleValidationErrors,
    HistoryController.create
);

router.get("/", auth, requireRoles("admin"), HistoryController.read);

router.get(
    "/:user_id",
    auth,
    requireRoles("admin"),
    validateId,
    handleValidationErrors,
    HistoryController.readById
);

router.put(
    "/:user_id/:manga_id",
    auth,
    requireRoles("admin"),
    validateHistory,
    handleValidationErrors,
    HistoryController.updateById
);

router.delete(
    "/:user_id/:manga_id",
    auth,
    requireRoles("admin"),
    validateDoubleIds,
    handleValidationErrors,
    HistoryController.deleteById
);

export default router;
