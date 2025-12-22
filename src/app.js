import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { helmetConfig, corsConfig } from './config/security.js';
import { requestId } from './middlewares/requestId.js';
import { httpLogger } from './middlewares/httpLogger.js';
import { errorHandler } from './middlewares/errorHandler.js';

import routes from './routes/index.js';

const app = express();

/* Seguridad y parsing */
app.use(helmet(helmetConfig));
app.use(cors(corsConfig));
app.use(express.json());

/* Observabilidad */
app.use(requestId);
app.use(httpLogger);

/* Rutas */
app.use('/', routes);

/* Error handler global (siempre al final) */
app.use(errorHandler);

export default app;
