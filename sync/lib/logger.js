import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: { app: 'vahome-rein-sync' },
  timestamp: pino.stdTimeFunctions.isoTime,
  // Pretty-print to stderr in dev; structured JSON in prod
  ...(process.env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: false, translateTime: 'SYS:standard' }
    }
  })
});

export function logRunStart(source, fullSync) {
  logger.info({ source, fullSync }, 'sync run starting');
}

export function logRunEnd(stats) {
  logger.info(stats, 'sync run completed');
}

export function logRunError(err, context = {}) {
  logger.error({ err: { message: err.message, stack: err.stack }, ...context }, 'sync run failed');
}
