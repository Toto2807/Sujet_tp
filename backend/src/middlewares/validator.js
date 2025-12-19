import { validationResult, param } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
};

export const validateId = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Resource ID must be a positive integer"),
];

export const validateDoubleIds = [
    param("user_id")
        .isInt({ min: 1 })
        .withMessage("Resource ID must be a positive integer"),

    param("manga_id")
        .isInt({ min: 1 })
        .withMessage("Resource ID must be a positive integer"),
];
