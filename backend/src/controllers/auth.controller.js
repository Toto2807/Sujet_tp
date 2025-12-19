import { User } from "../models/user.model.js";
import {
    hashPassword,
    verifyPassword,
    signTokens,
    verifyRefresh,
} from "../services/auth.service.js";
import { z } from "zod";
import xss from "xss";

export const AuthSchemas = {
    register: z.object({
        body: z.object({
            username: z.string().min(3),
            email: z.string().email(),
            password: z.string().min(6),
        }),
    }),
    login: z.object({
        body: z.object({
            email: z.string().email(),
            password: z.string().min(6),
        }),
    }),
    refresh: z.object({}),
};

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
};

export class AuthController {
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;
            const sanitizedUsername = xss(username);

            const existing = await User.readByEmail(email);

            if (existing) {
                return res.status(409).json({ message: "E-mail already used" });
            }

            const user = await User.create({
                username: sanitizedUsername,
                email,
                password: password,
                role: "user",
            });

            const tokens = signTokens(user);

            res.cookie("access_token", tokens.access, {
                ...COOKIE_OPTIONS,
                maxAge: 15 * 60 * 1000,
            });
            res.cookie("refresh_token", tokens.refresh, {
                ...COOKIE_OPTIONS,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(201).json({
                message: "Inscription réussie",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    is_banned: user.is_banned,
                },
            });
        } catch (err) {
            res.status(409).json({ error: err.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res
                    .status(400)
                    .json({ error: "All fields are required" });
            }

            const user = await User.readByEmail(email);
            if (!user) {
                return res.status(401).json({ error: "User not found" });
            }

            const check = await verifyPassword(password, user.password);
            if (!check) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const tokens = signTokens(user);

            res.cookie("access_token", tokens.access, {
                ...COOKIE_OPTIONS,
                maxAge: 15 * 60 * 1000,
            });
            res.cookie("refresh_token", tokens.refresh, {
                ...COOKIE_OPTIONS,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.json({
                message: "Connexion réussie",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    is_banned: user.is_banned,
                },
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async refresh(req, res) {
        try {
            const refreshToken = req.cookies.refresh_token;

            if (!refreshToken) {
                return res.status(401).json({ message: "Not authenticated" });
            }

            const payload = verifyRefresh(refreshToken);
            const user = await User.getById(payload.sub);

            if (!user) {
                res.clearCookie("access_token");
                res.clearCookie("refresh_token");
                return res.status(401).json({ message: "User not found" });
            }

            const tokens = signTokens(user);
            res.cookie("access_token", tokens.access, {
                ...COOKIE_OPTIONS,
                maxAge: 15 * 60 * 1000,
            });

            return res.json({ message: "Session refreshed" });
        } catch (e) {
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            return res.status(401).json({ message: "Session expired" });
        }
    }

    static async logout(req, res) {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return res.json({ message: "Logout successful" });
    }
}
