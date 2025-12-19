import { Fav } from "../models/fav.model.js";

export class FavController {
    static async create(req, res) {
        try {
            const { user_id, manga_id } = req.body;
            if (!user_id || !manga_id) {
                return res
                    .status(400)
                    .json({ error: "All fields are required" });
            }

            const fav = await Fav.create({
                userId: user_id,
                mangaId: manga_id,
            });
            return res.status(201).json(fav);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async read(req, res) {
        try {
            const favs = await Fav.read();
            return res.status(200).json(favs);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async readById(req, res) {
        try {
            const { user_id, manga_id } = req.params;
            const fav = await Fav.readById(user_id, manga_id);

            if (!fav) {
                return res.status(404).json({ error: "Fav not found" });
            }

            return res.status(200).json(fav);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async updateById(req, res) {
        try {
            const { user_id, manga_id } = req.params;
            const { user_id: new_user_id, manga_id: new_manga_id } = req.body;

            const fav = await Fav.updateById(user_id, manga_id, {
                userId: new_user_id,
                mangaId: new_manga_id,
            });

            if (!fav) {
                return res.status(404).json({ error: "Fav not found" });
            }

            return res.status(200).json(fav);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async deleteById(req, res) {
        try {
            const { user_id, manga_id } = req.params;
            const deletedCount = await Fav.deleteById(user_id, manga_id);

            if (deletedCount === 0) {
                return res.status(404).json({ error: "Fav not found" });
            }

            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}
