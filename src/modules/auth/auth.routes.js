import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireBootstrapSecret } from '../../middlewares/bootstrapSecret.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import {
  loginSchema,
  refreshSchema,
  logoutSchema,
  bootstrapAdminSchema,
} from './auth.schemas.js';
import { authController } from './auth.controller.js';
import { authRateLimit, strictAuthRateLimit } from '../../middlewares/rateLimit.js';

const router = Router();

router.post(
  '/bootstrap-admin',
  strictAuthRateLimit,
  requireBootstrapSecret,
  validate(bootstrapAdminSchema),
  asyncHandler(authController.bootstrap)
);

router.post(
  '/login',
  strictAuthRateLimit,
  validate(loginSchema),
  asyncHandler(authController.login)
);

router.post(
  '/refresh',
  authRateLimit,
  validate(refreshSchema),
  asyncHandler(authController.refresh)
);

router.post(
  '/logout',
  authRateLimit,
  validate(logoutSchema),
  asyncHandler(authController.logout)
);

router.get(
  '/me',
  authenticate,
  asyncHandler(authController.me)
);

export default router;
