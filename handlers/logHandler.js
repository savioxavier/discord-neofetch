import pino from 'pino';

const logger = pino({
  prettifier: await import('pino-colada'),
});

export default logger;
