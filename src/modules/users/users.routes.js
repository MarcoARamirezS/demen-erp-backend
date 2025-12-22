import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requirePermissions } from '../../middlewares/requirePermissions.js';
import { validate } from '../../middlewares/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { CORE_PERMS } from '../../constants/acl.js';

import {
  userCreateSchema,
  userUpdateSchema,
  userIdParamsSchema,
  listQuerySchema,
} from './users.schemas.js';
import { usersController } from './users.controller.js';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePermissions([CORE_PERMS.USERS_LIST]),
  validate(listQuerySchema, 'query'),
  asyncHandler(usersController.list)
);

router.get(
  '/:id',
  authenticate,
  requirePermissions([CORE_PERMS.USERS_READ]),
  validate(userIdParamsSchema, 'params'),
  asyncHandler(usersController.get)
);

router.post(
  '/',
  authenticate,
  requirePermissions([CORE_PERMS.USERS_CREATE]),
  validate(userCreateSchema),
  asyncHandler(usersController.create)
);

router.patch(
  '/:id',
  authenticate,
  requirePermissions([CORE_PERMS.USERS_UPDATE]),
  validate(userIdParamsSchema, 'params'),
  validate(userUpdateSchema),
  asyncHandler(usersController.update)
);

router.delete(
  '/:id',
  authenticate,
  requirePermissions([CORE_PERMS.USERS_DELETE]),
  validate(userIdParamsSchema, 'params'),
  asyncHandler(usersController.remove)
);

export default router;
