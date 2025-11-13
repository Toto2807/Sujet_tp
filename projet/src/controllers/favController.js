import * as Fav from '../models/favModel.js';

export const getMyFavs = async (req, res) => {
  try {
    const favs = await Fav.getFavsByUser(req.user.id);
    res.json(favs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const addToFav = async (req, res) => {
    try {
      console.log('req.user =', req.user);
      console.log('req.body.manga_id =', req.body.manga_id);
  
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Utilisateur non identifié' });
      }
  
      if (!req.body.manga_id) {
        return res.status(400).json({ message: 'manga_id manquant' });
      }
  
      const fav = await Fav.addFav(req.user.id, req.body.manga_id);
      res.status(201).json({ message: 'Favori ajouté', fav });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
  };
  
  

export const removeFromFav = async (req, res) => {
  try {
    await Fav.removeFav(req.user.id, req.params.manga_id);
    res.json({ message: 'Favori supprimé' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
