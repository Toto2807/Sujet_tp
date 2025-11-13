import { Router } from 'express';
import { addHistory, getHistory, deleteHistory } from '../controllers/historyController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/history', addHistory);
router.get('/history', getHistory);
router.delete('/history/:manga_id', deleteHistory);

export default router;
