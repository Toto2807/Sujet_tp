import { Router } from 'express';
import { HistoryController } from '../controllers/historyController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/history', authMiddleware, HistoryController.myHistory);
router.get('/history/:manga_id', authMiddleware, HistoryController.getOne);
router.post('/history', authMiddleware, HistoryController.upsert);
router.delete('/history/:manga_id', authMiddleware, HistoryController.remove);

export default router;
