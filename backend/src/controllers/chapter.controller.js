import { Chapter } from "../models/chapter.model.js";
import xss from "xss";

export class ChapterController {
    static async create(req, res) {
        try {
            const { manga_id, number, title, pages } = req.body;
            if (!manga_id || !number || !title || !pages) {
                return res
                    .status(400)
                    .json({ error: "All fields are required" });
            }

            const chapter = await Chapter.create({
                manga_id,
                number,
                title,
                pages,
            });

            return res.status(201).json(chapter);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async read(req, res) {
        try {
            const chapters = await Chapter.find();
            return res.status(200).json(chapters);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async readById(req, res) {
        try {
            const id = Number(req.params.id);
            const chapter = await Chapter.findById(id);

            if (!chapter) {
                return res.status(404).json({ error: "Chapter not found" });
            }

            return res.status(200).json(chapter);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async updateById(req, res) {
        try {
            const id = Number(req.params.id);
            const { manga_id, number, title, pages } = req.body;

            if (!manga_id || !number || !title || !pages) {
                return res
                    .status(400)
                    .json({ error: "All fields are required" });
            }

            const chapter = await Chapter.findByIdAndUpdate(
                id,
                {
                    manga_id,
                    number,
                    title,
                    pages,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

            if (!chapter) {
                return res.status(404).json({ error: "Chapter not found" });
            }

            return res.status(200).json(chapter);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async deleteById(req, res) {
        try {
            const id = Number(req.params.id);
            const chapter = await Chapter.findByIdAndDelete(id);

            if (!chapter) {
                return res.status(404).json({ error: "Chapter not found" });
            }

            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}
