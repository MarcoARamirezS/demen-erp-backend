import { log } from '../config/logger.js';

export function httpLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    log('info', 'http_request', {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start,
      ip: req.ip,
    });
  });

  next();
}
