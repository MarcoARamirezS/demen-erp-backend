import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requirePermissions } from '../../middlewares/requirePermissions.js';
import { validate } from '../../middlewares/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { CORE_PERMS } from '../../constants/acl.js';

import { auditIdParamsSchema, auditListQuerySchema } from './audit.schemas.js';
import { auditController } from './audit.controller.js';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePermissions([CORE_PERMS.AUDIT_LIST]),
  validate(auditListQuerySchema, 'query'),
  asyncHandler(auditController.list)
);

router.get(
  '/:id',
  authenticate,
  requirePermissions([CORE_PERMS.AUDIT_READ]),
  validate(auditIdParamsSchema, 'params'),
  asyncHandler(auditController.get)
);

export default router;
