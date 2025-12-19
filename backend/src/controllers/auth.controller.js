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

export const AuthController = {
    async register(req, res) {
        const { username, email, password } = req.body;
        const sanitizedUsername = xss(username);
        const existing = await UserModel.findByEmail(email);
        if (existing)
            return res.status(409).json({ message: "Email déjà utilisé" });

        const pwd = await hashPassword(password);
        const user = await UserModel.create({
            username: sanitizedUsername,
            email,
            password: pwd,
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
                is_ban: user.is_ban,
            },
        });
    },

    async login(req, res) {
        const { email, password } = req.body;
        const user = await UserModel.findByEmail(email);

        let isValid = false;
        if (user) {
            isValid = await verifyPassword(password, user.password);
        }
        if (!isValid || !user) {
            return res.status(401).json({ message: "Identifiants invalides" });
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
                is_ban: user.is_ban,
            },
        });
    },

    async refresh(req, res) {
        try {
            const refresh_token = req.cookies.refresh_token;

            if (!refresh_token) {
                return res.status(401).json({ message: "Non authentifié" });
            }

            const payload = verifyRefresh(refresh_token);
            const user = await UserModel.getById(payload.sub);

            if (!user) {
                res.clearCookie("access_token");
                res.clearCookie("refresh_token");
                return res.status(401).json({ message: "Utilisateur inconnu" });
            }

            const tokens = signTokens(user);
            res.cookie("access_token", tokens.access, {
                ...COOKIE_OPTIONS,
                maxAge: 15 * 60 * 1000,
            });

            return res.json({ message: "Session rafraîchie" });
        } catch (e) {
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            return res.status(401).json({ message: "Session expirée" });
        }
    },

    async logout(req, res) {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return res.json({ message: "Déconnexion réussie" });
    },
};
