import { MangaModel } from '../models/mangaModel.js';
import { z } from 'zod';

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
    const list = await MangaModel.list({ search: req.query.q });
    return res.json(list);
  },

  async getOne(req, res) {
    const item = await MangaModel.get(req.params.id);
    if (!item) return res.status(404).json({ message: 'Manga introuvable' });
    return res.json(item);
  },

  async create(req, res) {
    const created = await MangaModel.create(req.body);
    return res.status(201).json(created);
  },

  async update(req, res) {
    const updated = await MangaModel.update(req.params.id, req.body);
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
