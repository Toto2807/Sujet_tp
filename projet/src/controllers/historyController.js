import History from '../models/historyModel.js';

export const addHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { manga_id, last_chapter_id } = req.body;

    if (!manga_id || !last_chapter_id) {
      return res.status(400).json({ message: 'manga_id et last_chapter_id requis' });
    }

    const history = await History.addOrUpdate(userId, manga_id, last_chapter_id);
    res.status(201).json({ message: 'Historique mis à jour', history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await History.findByUser(userId);
    res.status(200).json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { manga_id } = req.params;

    await History.delete(userId, manga_id);
    res.status(200).json({ message: 'Historique supprimé' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
