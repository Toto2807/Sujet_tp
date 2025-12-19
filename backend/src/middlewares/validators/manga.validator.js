import xss from "xss";
import { body } from "express-validator";

export const validateManga = [
    body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 255 })
        .withMessage("Title must be at most 255 characters long")
        .customSanitizer((value) => xss(value)),

    body("description")
        .notEmpty()
        .withMessage("Description is required")
        .customSanitizer((value) => xss(value)),

    body("author")
        .notEmpty()
        .withMessage("Author is required")
        .isLength({ max: 255 })
        .withMessage("Author must be at most 255 characters long")
        .customSanitizer((value) => xss(value)),

    body("artist")
        .notEmpty()
        .withMessage("Artist is required")
        .isLength({ max: 255 })
        .withMessage("Artist must be at most 255 characters long")
        .customSanitizer((value) => xss(value)),
];
