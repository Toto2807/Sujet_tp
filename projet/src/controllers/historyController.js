import { HistoryModel } from '../models/historyModel.js';
import { MangaModel } from '../models/mangaModel.js';

export const HistoryController = {
  async myHistory(req, res) {
    const data = await HistoryModel.listByUser(req.user.id);
    return res.json(data);
  },

  async upsert(req, res) {
    const { manga_id, last_chapter_id } = req.body;
    if (!manga_id || !last_chapter_id) {
      return res.status(400).json({ message: 'manga_id et last_chapter_id requis' });
    }
    const exists = await MangaModel.get(manga_id);
    if (!exists) return res.status(404).json({ message: 'Manga introuvable' });
    const row = await HistoryModel.upsert(req.user.id, manga_id, last_chapter_id);
    return res.status(201).json(row);
  },

  async getOne(req, res) {
    const { manga_id } = req.params;
    const row = await HistoryModel.get(req.user.id, manga_id);
    if (!row) return res.status(404).json({ message: 'Historique introuvable' });
    return res.json(row);
  },

  async remove(req, res) {
    const { manga_id } = req.params;
    await HistoryModel.remove(req.user.id, manga_id);
    return res.json({ message: 'Historique supprimé' });
  }
};
