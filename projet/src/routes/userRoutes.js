import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { permit } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/me', authMiddleware, UserController.getMe);
router.put('/me', authMiddleware, UserController.updateMe);
router.delete('/me', authMiddleware, UserController.deleteMe);

router.get('/:id', authMiddleware, UserController.getOnePublic);

router.get('/admin/total', authMiddleware, permit('admin'), UserController.getAll);
router.post('/admin', authMiddleware, permit('admin'), UserController.createByAdmin);
router.put('/admin/role/:id', authMiddleware, permit('admin'), UserController.updateRole);
router.put('/admin/ban/:id', authMiddleware, permit('admin'), UserController.updateBanByAdmin);


export default router;
