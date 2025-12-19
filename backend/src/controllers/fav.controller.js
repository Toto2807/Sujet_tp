import { Fav } from "../models/fav.model.js";
import { Manga } from "../models/manga.model.js";

export class FavController {
    static async create(req, res) {
        try {
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async read(req, res) {
        try {
            const favs = await Fav.read();
            res.status(200).json(favs);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async readById(req, res) {
        try {
            const id = Number(req.params.id);
            const fav = await Fav.readById(id);

            if (!fav) {
                return res.status(404).json({ error: "Fav not found" });
            }

            res.status(200).json(fav);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async updateById(req, res) {
        try {
        } catch (err) {}
    }

    static async deleteById(req, res) {
        try {
            const id = Number(req.params.id);
            const deletedCount = await User.deleteById(id);

            if (deletedCount === 0) {
                return res.status(404).json({ error: "Fav not found" });
            }

            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
