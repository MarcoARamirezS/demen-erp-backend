import { Router } from 'express';

/* Importación de rutas por módulo */
import authRoutes from '../modules/auth/auth.routes.js';
import usersRoutes from '../modules/users/users.routes.js';
import rolesRoutes from '../modules/roles/roles.routes.js';
import permissionsRoutes from '../modules/permissions/permissions.routes.js';
import auditRoutes from '../modules/audit/audit.routes.js';

const router = Router();

/* Healthcheck base */
router.get('/health', (req, res) => {
  res.json({ ok: true });
});

/* Registro de módulos */
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/roles', rolesRoutes);
router.use('/permissions', permissionsRoutes);
router.use('/audit', auditRoutes);

export default router;
