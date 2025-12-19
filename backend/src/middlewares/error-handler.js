export function errorHandler(err, req, res, next) {
    const status = err.status || 500;
    const body = { error: err.message || "Internal server error" };

    if (process.env.NODE_ENV !== "production" && err.stack) {
        body.stack = err.stack;
    }

    return res.status(status).json(body);
}
