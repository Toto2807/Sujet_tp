import { Manga } from "../models/manga.model.js";

export class MangaController {
    static async create(req, res) {
        try {
            const { title, description, author, artist, tags, cover_url } =
                req.body;
            if (
                !title ||
                !description ||
                !author ||
                !artist ||
                !tags ||
                !cover_url
            ) {
                return res
                    .status(400)
                    .json({ error: "All fields are required" });
            }

            const manga = await Manga.create({
                title,
                description,
                author,
                artist,
                tags,
                coverUrl: cover_url,
            });
            return res.status(201).json(manga);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async read(req, res) {
        try {
            const mangas = await Manga.read();
            return res.status(200).json(mangas);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async readById(req, res) {
        try {
            const id = Number(req.params.id);
            const manga = await Manga.readById(id);

            if (!manga) {
                return res.status(404).json({ error: "Manga not found" });
            }

            return res.status(200).json(manga);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async updateById(req, res) {
        try {
            const { title, description, author, artist, tags, cover_url } =
                req.body;

            if (
                !title ||
                !description ||
                !author ||
                !artist ||
                !tags ||
                !cover_url
            ) {
                return res
                    .status(400)
                    .json({ error: "All fields are required" });
            }

            const id = Number(req.params.id);
            const manga = await Manga.updateById(id, {
                title,
                description,
                author,
                artist,
                tags,
                coverUrl: cover_url,
            });

            if (!manga) {
                return res.status(404).json({ error: "Manga not found" });
            }

            return res.status(200).json(manga);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    static async deleteById(req, res) {
        try {
            const id = Number(req.params.id);
            const deletedCount = await Manga.deleteById(id);

            if (deletedCount === 0) {
                return res.status(404).json({ error: "Manga not found" });
            }

            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}
