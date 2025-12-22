import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';

const SALT_ROUNDS = 12;

/* Passwords */
export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/* JWT */
export function signAccessToken(payload) {
  return jwt.sign(payload, jwtConfig.access.secret, {
    expiresIn: jwtConfig.access.expiresIn,
  });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, jwtConfig.refresh.secret, {
    expiresIn: jwtConfig.refresh.expiresIn,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, jwtConfig.access.secret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, jwtConfig.refresh.secret);
}
