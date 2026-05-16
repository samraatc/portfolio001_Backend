import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

import { env, isProd } from './config/env.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';
import { globalLimiter } from './middleware/rateLimit.middleware.js';
import apiRouter from './routes/index.js';

/**
 * Decide whether an origin should be allowed.
 * - In production: strict allowlist from CLIENT_ORIGINS.
 * - In development: also allow localhost and any private LAN IP on any port,
 *   so the apps work whether you visit via localhost, 127.0.0.1, or your LAN IP.
 */
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // curl, mobile, server-to-server
  if (env.clientOrigins.includes(origin)) return true;
  if (isProd) return false;

  try {
    const { hostname } = new URL(origin);
    // localhost / 127.0.0.1
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    // Private LAN ranges (10.x, 172.16-31.x, 192.168.x)
    if (/^10\./.test(hostname)) return true;
    if (/^192\.168\./.test(hostname)) return true;
    if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)) return true;
    return false;
  } catch {
    return false;
  }
};

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

// --- Security & infra middleware -----------------------------------------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin: (origin, cb) => {
      // Never throw — just deny by returning false. Throwing here turns into a 500
      // and confuses the browser (looks like a server error rather than a CORS block).
      if (isAllowedOrigin(origin)) return cb(null, true);
      // eslint-disable-next-line no-console
      console.warn(`[cors] blocked origin: ${origin}`);
      return cb(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(hpp());
if (env.nodeEnv !== 'test') app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.use(globalLimiter);

// --- Health check --------------------------------------------------------
app.get('/health', (_req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

// --- API -----------------------------------------------------------------
app.use(env.apiPrefix, apiRouter);

// --- 404 + error handler -------------------------------------------------
app.use(notFound);
app.use(errorHandler);

export default app;
