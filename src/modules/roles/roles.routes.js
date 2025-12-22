import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requirePermissions } from '../../middlewares/requirePermissions.js';
import { validate } from '../../middlewares/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { CORE_PERMS } from '../../constants/acl.js';

import {
  roleCreateSchema,
  roleUpdateSchema,
  roleIdParamsSchema,
  listQuerySchema,
} from './roles.schemas.js';
import { rolesController } from './roles.controller.js';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePermissions([CORE_PERMS.ROLES_LIST]),
  validate(listQuerySchema, 'query'),
  asyncHandler(rolesController.list)
);

router.get(
  '/:id',
  authenticate,
  requirePermissions([CORE_PERMS.ROLES_READ]),
  validate(roleIdParamsSchema, 'params'),
  asyncHandler(rolesController.get)
);

router.post(
  '/',
  authenticate,
  requirePermissions([CORE_PERMS.ROLES_CREATE]),
  validate(roleCreateSchema),
  asyncHandler(rolesController.create)
);

router.patch(
  '/:id',
  authenticate,
  requirePermissions([CORE_PERMS.ROLES_UPDATE]),
  validate(roleIdParamsSchema, 'params'),
  validate(roleUpdateSchema),
  asyncHandler(rolesController.update)
);

router.delete(
  '/:id',
  authenticate,
  requirePermissions([CORE_PERMS.ROLES_DELETE]),
  validate(roleIdParamsSchema, 'params'),
  asyncHandler(rolesController.remove)
);

export default router;
