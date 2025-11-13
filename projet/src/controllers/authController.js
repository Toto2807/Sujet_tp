import { UserModel } from '../models/userModel.js';
import { hashPassword, verifyPassword, signTokens, verifyRefresh } from '../services/auth.service.js';
import { z } from 'zod';

export const AuthSchemas = {
  register: z.object({
    body: z.object({
      username: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6)
    })
  }),
  login: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(6)
    })
  }),
  refresh: z.object({
    body: z.object({
      refresh_token: z.string().min(10)
    })
  })
};

export const AuthController = {
  async register(req, res) {
    const { username, email, password } = req.body;
    const existing = await UserModel.findByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email déjà utilisé' });
    const pwd = await hashPassword(password);
    const user = await UserModel.create({ username, email, password: pwd, role: 'user' });
    const tokens = signTokens(user);
    return res.status(201).json({ user: { id: user.id, username: user.username, email: user.email, role: user.role }, tokens });
  },

  async login(req, res) {
    const { email, password } = req.body;
    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });
    const ok = await verifyPassword(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Identifiants invalides' });
    const tokens = signTokens(user);
    return res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role }, tokens });
  },

  async refresh(req, res) {
    try {
      const { refresh_token } = req.body;
      const payload = verifyRefresh(refresh_token);
      const user = await UserModel.getById(payload.sub);
      if (!user) return res.status(401).json({ message: 'Utilisateur inconnu' });
      const tokens = signTokens(user);
      return res.json({ tokens });
    } catch (e) {
      return res.status(401).json({ message: 'Refresh token invalide ou expiré' });
    }
  }
};
