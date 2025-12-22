import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requirePermissions } from '../../middlewares/requirePermissions.js';
import { validate } from '../../middlewares/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { CORE_PERMS } from '../../constants/acl.js';

import {
  permissionCreateSchema,
  permissionUpdateSchema,
  permissionIdParamsSchema,
  listQuerySchema,
} from './permissions.schemas.js';
import { permissionsController } from './permissions.controller.js';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePermissions([CORE_PERMS.PERMISSIONS_LIST]),
  validate(listQuerySchema, 'query'),
  asyncHandler(permissionsController.list)
);

router.get(
  '/:code',
  authenticate,
  requirePermissions([CORE_PERMS.PERMISSIONS_READ]),
  validate(permissionIdParamsSchema, 'params'),
  asyncHandler(permissionsController.get)
);

router.post(
  '/',
  authenticate,
  requirePermissions([CORE_PERMS.PERMISSIONS_CREATE]),
  validate(permissionCreateSchema),
  asyncHandler(permissionsController.create)
);

router.patch(
  '/:code',
  authenticate,
  requirePermissions([CORE_PERMS.PERMISSIONS_UPDATE]),
  validate(permissionIdParamsSchema, 'params'),
  validate(permissionUpdateSchema),
  asyncHandler(permissionsController.update)
);

router.delete(
  '/:code',
  authenticate,
  requirePermissions([CORE_PERMS.PERMISSIONS_DELETE]),
  validate(permissionIdParamsSchema, 'params'),
  asyncHandler(permissionsController.remove)
);

export default router;
