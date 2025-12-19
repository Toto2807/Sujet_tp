import { User } from "../models/user.model.js";

export class UserController {
    static async create(req, res) {
        try {
            const { username, email, password, role } = req.body;
            if (!username || !email || !password || !role) {
                return res
                    .status(400)
                    .json({ error: "All fields are required" });
            }

            const user = await User.create({ username, email, password, role });
            return res.status(201).json(user);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async read(req, res) {
        try {
            const users = await User.read();
            return res.status(200).json(users);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async readById(req, res) {
        try {
            const id = Number(req.params.id);
            const user = await User.readById(id);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async updateById(req, res) {
        try {
            const id = Number(req.params.id);
            const { username, email, role, is_banned } = req.body;

            const user = await User.updateById(id, {
                username,
                email,
                role,
                isBanned: is_banned,
            });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async deleteById(req, res) {
        try {
            const id = Number(req.params.id);
            const deletedCount = await User.deleteById(id);

            if (deletedCount === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}
