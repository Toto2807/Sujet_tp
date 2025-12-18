import { FavModel } from '../models/favModel.js';
import { MangaModel } from '../models/mangaModel.js';

export async function getMyFavs(req, res) {
  const data = await FavModel.listByUser(req.user.id);
  return res.json(data);
}

export async function addToFav(req, res) {
  const { id_manga } = req.body;
  if (!id_manga) return res.status(400).json({ message: 'id_manga manquant' });
  const exists = await MangaModel.get(id_manga);
  if (!exists) return res.status(404).json({ message: 'Manga introuvable' });
  await FavModel.add(req.user.id, id_manga);
  return res.status(201).json({ message: 'Ajouté aux favoris' });
}

export async function removeFromFav(req, res) {
  const { manga_id } = req.params;
  await FavModel.remove(req.user.id, manga_id);
  return res.json({ message: 'Retiré des favoris' });
}
