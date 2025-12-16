import { MangaModel } from '../models/mangaModel.js';
import { z } from 'zod';
import xss from 'xss';

const createSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    author: z.string().optional(),
    artist: z.string().optional(),
    tags: z.array(z.string()).optional(),
    cover_url: z.string().url().optional(),
    published_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
  })
});

const updateSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    author: z.string().optional(),
    artist: z.string().optional(),
    tags: z.array(z.string()).optional(),
    cover_url: z.string().url().optional(),
    published_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
  })
});

export const MangaController = {
  validate: { createSchema, updateSchema },

  async getAll(req, res) {
    const searchQuery = req.query.q ? xss(req.query.q) : undefined;
    const list = await MangaModel.list({ search: searchQuery });
    return res.json(list);
  },

  async getOne(req, res) {
    const item = await MangaModel.get(req.params.id);
    if (!item) return res.status(404).json({ message: 'Manga introuvable' });
    return res.json(item);
  },

  async create(req, res) {
    const sanitizedBody = {
      ...req.body,
      title: xss(req.body.title),
      description: req.body.description ? xss(req.body.description) : undefined,
      author: req.body.author ? xss(req.body.author) : undefined,
      artist: req.body.artist ? xss(req.body.artist) : undefined,
      // Les tags sont un tableau, on nettoie chaque élément
      tags: req.body.tags ? req.body.tags.map(t => xss(t)) : undefined
    };

    const created = await MangaModel.create(sanitizedBody);
    return res.status(201).json(created);
  },

  async update(req, res) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.title) sanitizedBody.title = xss(sanitizedBody.title);
    if (sanitizedBody.description) sanitizedBody.description = xss(sanitizedBody.description);
    if (sanitizedBody.author) sanitizedBody.author = xss(sanitizedBody.author);
    if (sanitizedBody.artist) sanitizedBody.artist = xss(sanitizedBody.artist);
    if (sanitizedBody.tags) sanitizedBody.tags = sanitizedBody.tags.map(t => xss(t));

    const updated = await MangaModel.update(req.params.id, sanitizedBody);
    if (!updated) return res.status(404).json({ message: 'Manga introuvable' });
    return res.json(updated);
  },

  async remove(req, res) {
    const exists = await MangaModel.get(req.params.id);
    if (!exists) return res.status(404).json({ message: 'Manga introuvable' });
    await MangaModel.remove(req.params.id);
    return res.json({ message: 'Supprimé' });
  }
};