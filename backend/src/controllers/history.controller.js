import { History } from "../models/history.model.js";
import { Manga } from "../models/manga.model.js";

export class HistoryController {
    static async create(req, res) {
        try {
            const { user_id, manga_id, last_chapter_id } = req.body;
            if (!user_id || !manga_id || !last_chapter_id) {
                return res
                    .status(400)
                    .json({ error: "All fields are required" });
            }

            const history = History.create([
                user_id,
                manga_id,
                last_chapter_id,
            ]);
            return res.status(201).json(history);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async read(req, res) {
        try {
            const histories = await History.read();
            res.status(200).json(histories);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async readById(req, res) {
        try {
            const id = Number(req.params.id);
            const history = await History.readById(id);

            if (!history) {
                return res.status(404).json({ error: "History not found" });
            }

            res.status(200).json(history);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async updateById(req, res) {
        try {
            const id = Number(req.params.id);
            const { last_chapter_id } = req.body;

            const history = await History.updateById(id, { last_chapter_id });

            if (!history) {
                return res.status(404).json({ error: "History not found" });
            }

            res.status(200).json(history);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async deleteById(req, res) {
        try {
            const id = Number(req.params.id);
            const deletedCount = await User.deleteById(id);

            if (deletedCount === 0) {
                return res.status(404).json({ error: "History not found" });
            }

            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
