import { log } from '../config/logger.js';

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;

  log('error', err.message || 'Unhandled error', {
    requestId: req.requestId,
    status,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  res.status(status).json({
    message: err.message || 'Internal server error',
    requestId: req.requestId,
  });
}
