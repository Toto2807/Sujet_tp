export function requireRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const userRole = req.user.role;
        const hasAccess =
            allowedRoles.includes(userRole) || userRole === "admin";

        if (!hasAccess) {
            return res.status(403).json({ error: "Access denied" });
        }

        next();
    };
}
