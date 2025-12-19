import { Manga } from "../models/manga.model.js";
import xss from "xss";

export class MangaController {
    static async create(req, res) {
        try {
            const sanitizedBody = {
                ...req.body,
                title: xss(req.body.title),
                description: req.body.description
                    ? xss(req.body.description)
                    : undefined,
                author: req.body.author ? xss(req.body.author) : undefined,
                artist: req.body.artist ? xss(req.body.artist) : undefined,
                tags: req.body.tags
                    ? req.body.tags.map((t) => xss(t))
                    : undefined,
            };

            const manga = await Manga.create(sanitizedBody);
            return res.status(201).json(manga);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async read(req, res) {
        try {
            const mangas = await Manga.read();
            res.status(200).json(mangas);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async readById(req, res) {
        try {
            const id = Number(req.params.id);
            const manga = await Manga.readById(id);

            if (!manga) {
                return res.status(404).json({ error: "Manga not found" });
            }

            res.status(200).json(manga);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async updateById(req, res) {
        try {
            const sanitizedBody = { ...req.body };
            if (sanitizedBody.title)
                sanitizedBody.title = xss(sanitizedBody.title);
            if (sanitizedBody.description)
                sanitizedBody.description = xss(sanitizedBody.description);
            if (sanitizedBody.author)
                sanitizedBody.author = xss(sanitizedBody.author);
            if (sanitizedBody.artist)
                sanitizedBody.artist = xss(sanitizedBody.artist);
            if (sanitizedBody.tags)
                sanitizedBody.tags = sanitizedBody.tags.map((t) => xss(t));

            const manga = await Manga.updateById(id, sanitizedBody);
            if (!manga) {
                return res.status(404).json({ error: "Manga not found" });
            }

            res.status(200).json(manga);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async deleteById(req, res) {
        try {
            const id = Number(req.params.id);
            const deletedCount = await Manga.deleteById(id);

            if (deletedCount === 0) {
                return res.status(404).json({ error: "Manga not found" });
            }

            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
