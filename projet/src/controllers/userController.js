import { UserModel } from '../models/userModel.js';

export const UserController = {
  async getAll(req, res) {
    const users = await UserModel.getAll();
    return res.json(users);
  },

  async getMe(req, res) {
    const me = await UserModel.getPublicById(req.user.id);
    return res.json(me);
  },

  async updateMe(req, res) {
    const updated = await UserModel.updateMe(req.user.id, { username: req.body.username, email: req.body.email });
    return res.json(updated);
  },

  async deleteMe(req, res) {
    await UserModel.deleteById(req.user.id);
    return res.json({ message: 'Compte supprimé' });
  },

  async getOnePublic(req, res) {
    const u = await UserModel.getPublicById(req.params.id);
    if (!u) return res.status(404).json({ message: 'Utilisateur introuvable' });
    return res.json(u);
  },

  async createByAdmin(req, res) {
    const u = await UserModel.create({ username: req.body.username, email: req.body.email, password: req.body.password, role: req.body.role || 'user' });
    return res.status(201).json(u);
  },

  async deleteByAdmin(req, res) {
    await UserModel.deleteById(req.params.id);
    return res.json({ message: 'Utilisateur supprimé par admin' });
  },
  
  async updateRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;
  const validRoles = ['user', 'moderateur', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Rôle invalide' });
  }
  const updated = await UserModel.updateRole(id, role);
  if (!updated) return res.status(404).json({ message: 'Utilisateur introuvable' });
  return res.json({ message: `Rôle mis à jour en ${role}`, user: updated });
  },

  async updateBanByAdmin(req, res) {
  const { id } = req.params;
  const { is_ban } = req.body;

  if (typeof is_ban !== 'boolean') {
    return res.status(400).json({ message: 'is_ban doit être un booléen' });
  }

  const user = await UserModel.updateBan(id, is_ban);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur introuvable' });
  }

  return res.json({
    message: is_ban ? 'Utilisateur banni' : 'Utilisateur débanni',
    user
  });
}


};


