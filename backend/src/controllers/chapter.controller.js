import { Chapter } from "../models/chapter.model.js";
import xss from "xss";

export class ChapterController {
    static async create(req, res) {
        try {
            const sanitizedBody = { ...req.body };
            if (sanitizedBody.title) {
                sanitizedBody.title = xss(sanitizedBody.title);
            }

            const chapter = await Chapter.create(sanitizedBody);
            res.status(201).json(chapter);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async read(req, res) {
        try {
            const chapters = await Chapter.find();
            res.status(200).json(chapters);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async readById(req, res) {
        try {
            const id = Number(req.params.id);
            const chapter = await Chapter.findById(id);

            if (!chapter) {
                return res.status(404).json({ error: "Chapter not found" });
            }

            res.status(200).json(chapter);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async updateById(req, res) {
        try {
            const id = Number(req.params.id);
            const sanitizedBody = { ...req.body };

            if (sanitizedBody.title) {
                sanitizedBody.title === xss(sanitizedBody.title);
            }

            const chapter = await Chapter.findByIdAndUpdate(id, sanitizedBody, {
                new: true,
            });

            if (!chapter) {
                return res.status(404).json({ error: "Chapter not found" });
            }

            res.status(200).json(chapter);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async deleteById(req, res) {
        try {
            const id = Number(req.params.id);
            const chapter = await Chapter.findByIdAndDelete(id);

            if (!chapter) {
                return res.status(404).json({ error: "Chapter not found" });
            }

            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
