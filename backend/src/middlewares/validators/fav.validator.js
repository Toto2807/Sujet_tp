import xss from "xss";
import { body } from "express-validator";

export const validateFav = [
    body("user_id")
        .notEmpty()
        .withMessage("User ID is required")
        .isNumeric()
        .withMessage("User ID must be a number")
        .customSanitizer((value) => xss(value)),

    body("manga_id")
        .notEmpty()
        .withMessage("Manga ID is required")
        .isNumeric()
        .withMessage("Manga ID must be a number")
        .customSanitizer((value) => xss(value)),
];
