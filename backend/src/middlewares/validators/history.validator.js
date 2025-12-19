import xss from "xss";
import { body, param } from "express-validator";

export const validateHistory = [
    param("user_id")
        .notEmpty()
        .withMessage("User ID is required")
        .isNumeric()
        .withMessage("User ID must be a number")
        .customSanitizer((value) => xss(value)),

    param("manga_id")
        .notEmpty()
        .withMessage("Manga ID is required")
        .isNumeric()
        .withMessage("Manga ID must be a number")
        .customSanitizer((value) => xss(value)),

    body("last_chapter_id")
        .notEmpty()
        .withMessage("Last read chapter is required")
        .isNumeric()
        .withMessage("Last read chapter must be a number")
        .customSanitizer((value) => xss(value)),
];
