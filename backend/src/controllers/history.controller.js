import { History } from "../models/history.model.js";

export class HistoryController {
    static async create(req, res) {
        try {
            const { user_id, manga_id, last_chapter_id } = req.body;
            if (!user_id || !manga_id || !last_chapter_id) {
                return res
                    .status(400)
                    .json({ error: "All fields are required" });
            }

            const history = await History.create({
                userId: user_id,
                mangaId: manga_id,
                lastChapterId: last_chapter_id,
            });
            return res.status(201).json(history);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async read(req, res) {
        try {
            const histories = await History.read();
            return res.status(200).json(histories);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async readById(req, res) {
        try {
            const { user_id } = req.params;
            const history = await History.readById(user_id);

            if (!history) {
                return res.status(404).json({ error: "History not found" });
            }

            return res.status(200).json(history);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async updateById(req, res) {
        try {
            const { user_id, manga_id } = req.params;
            const { last_chapter_id } = req.body;

            const history = await History.updateById(user_id, manga_id, {
                last_chapter_id,
            });

            if (!history) {
                return res.status(404).json({ error: "History not found" });
            }

            return res.status(200).json(history);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async deleteById(req, res) {
        try {
            const { user_id, manga_id } = req.params;
            const deletedCount = await History.deleteById(user_id, manga_id);

            if (deletedCount === 0) {
                return res.status(404).json({ error: "History not found" });
            }

            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}
