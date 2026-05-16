import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const server = http.createServer(app);

const start = async () => {
  await connectDB();
  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] Listening on http://localhost:${env.port} (${env.nodeEnv})`);
    // eslint-disable-next-line no-console
    console.log(`[server] API base: ${env.apiPrefix}`);
  });
};

start();

const shutdown = (signal) => () => {
  // eslint-disable-next-line no-console
  console.log(`\n[server] ${signal} received — shutting down gracefully`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGINT', shutdown('SIGINT'));
process.on('SIGTERM', shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('[server] Unhandled rejection:', reason);
});
