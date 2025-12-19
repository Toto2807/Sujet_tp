import xss from "xss";
import { body } from "express-validator";

export const validateUser = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .customSanitizer((value) => xss(value)),

    body("email")
        .isEmail()
        .withMessage("Invalid email format")
        .escape()
        .normalizeEmail(),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("role")
        .optional()
        .isIn(["admin", "user"])
        .withMessage("Invalid role")
        .customSanitizer((value) => xss(value)),
];
