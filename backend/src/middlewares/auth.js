import { verifyAccess } from "../services/auth.service.js";

export function auth(req, res, next) {
    try {
        const token = req.cookies.access_token;

        if (!token) {
            return res
                .status(401)
                .json({ message: "Authentification requise" });
        }

        const payload = verifyAccess(token);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalide ou expiré" });
    }
}
