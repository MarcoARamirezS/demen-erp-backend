export const corsConfig = {
  origin(origin, callback) {
    // Permitir requests sin origin (Postman, server-to-server)
    if (!origin) return callback(null, true);

    const allowed = (process.env.CORS_ORIGINS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (!allowed.length || allowed.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

export const helmetConfig = {
  contentSecurityPolicy: false, // API pura
};
