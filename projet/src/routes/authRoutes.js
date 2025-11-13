import { Router } from 'express';
import { AuthController, AuthSchemas } from '../controllers/authController.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/auth/register', authLimiter, validate(AuthSchemas.register), AuthController.register);
router.post('/auth/login', authLimiter, validate(AuthSchemas.login), AuthController.login);
router.post('/auth/refresh', authLimiter, validate(AuthSchemas.refresh), AuthController.refresh);

export default router;
