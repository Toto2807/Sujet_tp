import { Chapter } from '../models/chapterModel.js';
import xss from 'xss';

export const ChapterController = {
  async list(req, res) {
    const manga_id = req.query.manga_id ? xss(req.query.manga_id) : null;
    const filter = manga_id ? { manga_id } : {};
    const data = await Chapter.find(filter).sort({ chap_number: 1 }).lean().exec();
    return res.json(data);
  },

  async get(req, res) {
    const ch = await Chapter.findById(req.params.id).lean().exec();
    if (!ch) return res.status(404).json({ message: 'Chapitre introuvable' });
    return res.json(ch);
  },

  async create(req, res) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.title) {
        sanitizedBody.title = xss(sanitizedBody.title);
    }

    const doc = await Chapter.create(sanitizedBody);
    return res.status(201).json(doc);
  },

  async update(req, res) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.title) {
        sanitizedBody.title = xss(sanitizedBody.title);
    }

    const doc = await Chapter.findByIdAndUpdate(req.params.id, sanitizedBody, { new: true }).exec();
    if (!doc) return res.status(404).json({ message: 'Chapitre introuvable' });
    return res.json(doc);
  },

  async remove(req, res) {
    const r = await Chapter.findByIdAndDelete(req.params.id).exec();
    if (!r) return res.status(404).json({ message: 'Chapitre introuvable' });
    return res.json({ message: 'Supprimé' });
  }
};