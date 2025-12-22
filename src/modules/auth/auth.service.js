import admin from 'firebase-admin';
import { usersRepository } from '../users/users.repository.js';
import { rolesRepository } from '../roles/roles.repository.js';
import { authRepository } from './auth.repository.js';
import { auditService } from '../audit/audit.service.js';

import {
  comparePassword,
  hashPassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../config/crypto.js';

import { hashToken } from '../../utils/tokenHash.js';
import { CORE_PERMS } from '../../constants/acl.js';

function uniqueStrings(arr) {
  return Array.from(new Set(arr.filter(Boolean)));
}

async function computeEffectivePermissions(user) {
  const direct = Array.isArray(user.permissionCodes) ? user.permissionCodes : [];
  const roleIds = Array.isArray(user.roleIds) ? user.roleIds : [];

  const roles = await rolesRepository.findManyByIds(roleIds);
  const rolePerms = roles.flatMap((r) => (Array.isArray(r.permissionCodes) ? r.permissionCodes : []));

  return uniqueStrings([...direct, ...rolePerms]);
}

export const authService = {
  async bootstrapFirstAdmin(input, { ip = null, userAgent = null } = {}) {
    const existingCount = await usersRepository.countAll();
    if (existingCount > 0) {
      const err = new Error('Bootstrap not allowed: users already exist');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await hashPassword(input.password);

    // Importante: NO “hardcodear roles”, pero sí necesitas un set mínimo de permisos core.
    // Aquí se asignan permisos DIRECTOS al primer admin (DB-first; luego podrás administrarlos en UI).
    const permissionCodes = uniqueStrings([
      CORE_PERMS.USERS_CREATE,
      CORE_PERMS.USERS_READ,
      CORE_PERMS.USERS_UPDATE,
      CORE_PERMS.USERS_DELETE,
      CORE_PERMS.USERS_LIST,
      CORE_PERMS.ROLES_CREATE,
      CORE_PERMS.ROLES_READ,
      CORE_PERMS.ROLES_UPDATE,
      CORE_PERMS.ROLES_DELETE,
      CORE_PERMS.ROLES_LIST,
      CORE_PERMS.PERMISSIONS_CREATE,
      CORE_PERMS.PERMISSIONS_READ,
      CORE_PERMS.PERMISSIONS_UPDATE,
      CORE_PERMS.PERMISSIONS_DELETE,
      CORE_PERMS.PERMISSIONS_LIST,
      CORE_PERMS.AUDIT_LIST,
      CORE_PERMS.AUDIT_READ,
    ]);

    const user = await usersRepository.create({
      nombre: input.nombre,
      apaterno: input.apaterno,
      amaterno: input.amaterno || '',
      direccion: input.direccion || '',
      telefono: input.telefono || '',
      ciudad: input.ciudad || '',
      estado: input.estado || '',
      usuario: input.usuario,
      passwordHash,
      activo: true,
      roleIds: [],
      permissionCodes,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await auditService.log({
      actorUserId: null,
      action: 'bootstrap_admin',
      resource: 'users',
      resourceId: user.id,
      meta: { ip, userAgent, usuario: input.usuario },
    });

    return { id: user.id, usuario: input.usuario };
  },

  async login({ usuario, password }, { ip = null, userAgent = null } = {}) {
    const user = await usersRepository.findByUsername(usuario);
    if (!user || user.activo !== true) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) {
      await auditService.log({
        actorUserId: user?.id || null,
        action: 'login_failed',
        resource: 'auth',
        resourceId: null,
        meta: { ip, userAgent, usuario },
      });

      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const permissions = await computeEffectivePermissions(user);

    const accessToken = signAccessToken({
      sub: user.id,
      permissions,
    });

    const refreshToken = signRefreshToken({
      sub: user.id,
    });

    const tokenHash = hashToken(refreshToken);

    // exp de refresh: se valida por JWT; en DB guardamos una fecha para reporting/revocation policy
    const expiresAt = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

    await authRepository.createRefreshToken({
      userId: user.id,
      tokenHash,
      expiresAt,
      userAgent,
      ip,
    });

    await auditService.log({
      actorUserId: user.id,
      action: 'login_success',
      resource: 'auth',
      meta: { ip, userAgent },
    });

    return { accessToken, refreshToken };
  },

  async refresh({ refreshToken }, { ip = null, userAgent = null } = {}) {
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      const err = new Error('Invalid refresh token');
      err.statusCode = 401;
      throw err;
    }

    const tokenHash = hashToken(refreshToken);
    const dbToken = await authRepository.findActiveByHash(tokenHash);
    if (!dbToken) {
      const err = new Error('Refresh token revoked or not found');
      err.statusCode = 401;
      throw err;
    }

    const user = await usersRepository.findById(decoded.sub);
    if (!user || user.activo !== true) {
      const err = new Error('User inactive');
      err.statusCode = 401;
      throw err;
    }

    const permissions = await computeEffectivePermissions(user);

    // Rotación de refresh token (mejor práctica)
    const newAccessToken = signAccessToken({ sub: user.id, permissions });
    const newRefreshToken = signRefreshToken({ sub: user.id });
    const newHash = hashToken(newRefreshToken);

    await authRepository.revokeToken({ id: dbToken.id, replacedByTokenHash: newHash });

    const expiresAt = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    await authRepository.createRefreshToken({
      userId: user.id,
      tokenHash: newHash,
      expiresAt,
      userAgent,
      ip,
    });

    await auditService.log({
      actorUserId: user.id,
      action: 'refresh_success',
      resource: 'auth',
      meta: { ip, userAgent },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  async logout({ refreshToken }, { ip = null, userAgent = null } = {}) {
    const tokenHash = hashToken(refreshToken);
    const dbToken = await authRepository.findActiveByHash(tokenHash);
    if (!dbToken) return;

    await authRepository.revokeToken({ id: dbToken.id });

    await auditService.log({
      actorUserId: dbToken.userId,
      action: 'logout',
      resource: 'auth',
      meta: { ip, userAgent },
    });
  },
};
