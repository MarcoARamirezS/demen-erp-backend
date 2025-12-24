import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { helmetConfig, corsConfig } from './config/security.js';
import { requestId } from './middlewares/requestId.js';
import { httpLogger } from './middlewares/httpLogger.js';
import { errorHandler } from './middlewares/errorHandler.js';

import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

/* ================================
   Seguridad y parsing
================================ */
app.use(helmet(helmetConfig));
app.use(cors(corsConfig));
app.use(express.json());

/* ================================
   Observabilidad
================================ */
app.use(requestId);
app.use(httpLogger);

/* ================================
   Rutas
================================ */
app.use('/api', routes);

/* ================================
   Error handler global
   (SIEMPRE al final)
================================ */
app.use(errorHandler);

/* ================================
   Server bootstrap
================================ */
app.listen(PORT, () => {
  console.log(`🚀 DEMEN Backend running on port ${PORT}`);
});

export default app;
