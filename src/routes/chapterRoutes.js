import { Router } from 'express';
import { ChapterController } from '../controllers/chapterController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { permit } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/chapters', authMiddleware, ChapterController.list);
router.get('/chapters/:id', authMiddleware, ChapterController.get);
router.post('/chapters', authMiddleware, permit('admin','moderateur'), ChapterController.create);
router.put('/chapters/:id', authMiddleware, permit('admin','moderateur'), ChapterController.update);
router.delete('/chapters/:id', authMiddleware, permit('admin'), ChapterController.remove);

export default router;
