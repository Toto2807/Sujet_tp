import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

export async function hashPassword(plain) {
    return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
}

export function signTokens(user) {
    const payload = { sub: user.id, role: user.role };
    const access = jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: ACCESS_EXPIRES,
    });
    const refresh = jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: REFRESH_EXPIRES,
    });
    return { access, refresh };
}

export function verifyAccess(token) {
    return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefresh(token) {
    return jwt.verify(token, REFRESH_SECRET);
}
