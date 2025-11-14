import { Router } from 'express';
import { MangaController } from '../controllers/mangaController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { permit } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();

router.get('/manga', MangaController.getAll);
router.get('/manga/:id', MangaController.getOne);
router.post('/manga', authMiddleware, permit('admin'),validate(MangaController.validate.createSchema),MangaController.create);
router.put('/manga/:id', authMiddleware, permit('admin','moderateur'),validate(MangaController.validate.updateSchema),MangaController.update);
router.delete('/manga/:id', authMiddleware, permit('admin'), MangaController.remove);

export default router;
