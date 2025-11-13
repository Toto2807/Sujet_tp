import * as Manga from '../models/mangaModel.js';

export const getAll = async (req, res) => {
  try {
    const mangas = await Manga.getAllManga();
    res.json(mangas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getOne = async (req, res) => {
  try {
    const manga = await Manga.getMangaById(req.params.id);
    if (!manga) return res.status(404).json({ message: 'Manga introuvable' });
    res.json(manga);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const create = async (req, res) => {
  try {
    const manga = await Manga.createManga(req.body);
    res.status(201).json({ message: 'Manga créé', manga });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
