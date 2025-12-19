import { Router } from "express";
import { HistoryController } from "../controllers/history.controller.js";
import { auth } from "../middlewares/auth.js";
import { requireRoles } from "../middlewares/roles.js";

const router = Router();

router.post("/", auth, requireRoles(["admin"]), HistoryController.create);

router.get("/", auth, requireRoles(["admin"]), HistoryController.read);

router.get("/:id", auth, requireRoles(["admin"]), HistoryController.readById);

router.put("/:id", auth, requireRoles(["admin"]), HistoryController.updateById);

router.delete(
    "/:id",
    auth,
    requireRoles(["admin"]),
    HistoryController.deleteById
);

export default router;
