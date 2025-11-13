import { Router } from 'express';
import { getAll, getOne, create } from '../controllers/mangaController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { permit } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/manga', getAll);
router.get('/manga/:id', getOne);
router.post('/manga', authMiddleware, permit('admin'), create);

export default router;
