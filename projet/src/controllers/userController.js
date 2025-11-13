// import { UserModel } from '../models/userModel.js';

// export const UserController = {
//   async getAllUsers(req, res) {
//     try {
//       const users = await UserModel.getAll();
//       res.status(200).json(users);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Erreur serveur' });
//     }
//   },

//   async getUserById(req, res) {
//     try {
//       const user = await UserModel.getById(req.params.id);
//       if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
//       res.status(200).json(user);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Erreur serveur' });
//     }
//   }
// };


import { UserModel } from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';


function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export const UserController = {
  async getAll(req, res) {
    try {
      const users = await UserModel.findAll({ limit: parseInt(req.query.limit) || 100, offset: parseInt(req.query.offset) || 0 });
      const total = await UserModel.countAll();
      return res.json({ total, users });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur serveur', detail: err.message });
    }
  },


  async getOnePublic(req, res) {
    try {
      const id = req.params.id;
      const user = await UserModel.findById(id);
      if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
      const publicUser = { id: user.id, username: user.username, role: user.role };
      return res.json(publicUser);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },


  async getMe(req, res) {
    try {
      const id = req.user.id;
      const user = await UserModel.findById(id);
      if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
      return res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },


  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) return res.status(400).json({ message: 'Champs manquants' });
      const user = await UserModel.create({ username, email, password, role: 'user' });
      const token = signToken(user);
      return res.status(201).json({ user, token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur création', detail: err.message });
    }
  },


  async createByAdmin(req, res) {
    try {
      const { id, username, email, password, role = 'user' } = req.body;
      if (!username || !email || !password) return res.status(400).json({ message: 'Champs manquants' });
      const user = await UserModel.create({ id: id || null, username, email, password, role });
      return res.status(201).json({ user });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur création admin', detail: err.message });
    }
  },

  async updateMe(req, res) {
    try {
      const id = req.user.id;
      const { username, email } = req.body;
      if (!username && !email) return res.status(400).json({ message: 'Aucun champ à mettre à jour' });
      const updated = await UserModel.updateById(id, { username, email });
      if (!updated) return res.status(404).json({ message: 'Utilisateur introuvable' });
      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur mise à jour', detail: err.message });
    }
  },


  async deleteMe(req, res) {
    try {
      const id = req.user.id;
      await UserModel.deleteById(id);
      return res.json({ message: 'Compte supprimé' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur suppression', detail: err.message });
    }
  },

  async deleteByAdmin(req, res) {
    try {
      const id = req.params.id;
      await UserModel.deleteById(id);
      return res.json({ message: 'Utilisateur supprimé par admin' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur suppression admin', detail: err.message });
    }
  }
};
