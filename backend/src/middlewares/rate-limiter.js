import rateLimit from "express-rate-limit";

const WINDOW_MS = Number(process.env.COOLDOWN_MINUTES) * 60 * 1000;

export const apiLimiter = rateLimit({
    windowMs: WINDOW_MS,
    max: Number(process.env.MAX_REQUESTS),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: `Too many requests from this IP, please try again
                after ${process.env.COOLDOWN_MINUTES} minutes.`,
    },
});

export const authLimiter = rateLimit({
    windowMs: WINDOW_MS,
    max: Number(process.env.MAX_AUTH_REQUESTS),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: `Too many authentication attempts from this IP, please
                try again after ${process.env.COOLDOWN_MINUTES} minutes.`,
    },
});
