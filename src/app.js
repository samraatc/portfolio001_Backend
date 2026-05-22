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
 * Determine if a request Origin header is allowed.
 * - Same-origin / non-browser requests (no Origin header) are always allowed.
 * - The configured CLIENT_ORIGINS list is matched exactly (case- and
 *   trailing-slash-insensitive - normalization happens in env.js).
 * - In non-production, common local/LAN hostnames are auto-allowed so
 *   you do not have to keep editing env vars while developing.
 */
const isAllowedOrigin = (origin) => {
  // Server-to-server / same-origin requests (curl, Postman, SSR) have no
  // Origin header - allow them through.
  if (!origin) return true;

  const normalized = origin.replace(/\/+$/, '').toLowerCase();
  if (env.clientOrigins.includes(normalized)) return true;

  if (isProd) return false;

  try {
    const { hostname } = new URL(normalized);
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
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

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const corsOptions = {
  origin: (origin, cb) => {
    if (isAllowedOrigin(origin)) return cb(null, true);
    // Log with the full allow-list to make production debugging trivial.
    // We do NOT throw here - throwing turns a CORS block into a 500 with
    // no CORS headers, which the browser surfaces as a confusing "Network
    // Error". Returning `false` is the correct contract: the request
    // still completes, the browser blocks it, and you see a clean CORS
    // error in DevTools.
    console.warn(
      '[cors] blocked origin: "' + origin + '". Allowed: [' +
        env.clientOrigins.join(', ') + ']'
    );
    return cb(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Disposition'],
  maxAge: 600, // cache preflight for 10 minutes
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// Express 5 / path-to-regexp v6 reject the bare '*' literal; use a regex
// so this works on both Express 4 and 5.
app.options(/.*/, cors(corsOptions));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(hpp());
if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}

app.use(globalLimiter);

app.get('/health', (_req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

app.use(env.apiPrefix, apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
