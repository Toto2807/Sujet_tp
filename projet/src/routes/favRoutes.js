import { Router } from 'express';
import { getMyFavs, addToFav, removeFromFav } from '../controllers/favController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/favs', authMiddleware, getMyFavs);
router.post('/favs', authMiddleware, addToFav);
router.delete('/favs/:manga_id', authMiddleware, removeFromFav);

export default router;
