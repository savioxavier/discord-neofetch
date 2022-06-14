// import { Chalk } from 'chalk';

// const chalk = new Chalk({ level: 2 });

// const logger = {
//   info: (message) => {
//     console.log(chalk.green(message));
//   },
//   error: (message) => {
//     console.error(chalk.red(message));
//   },
// };

// export default logger;

import pino from 'pino';

const logger = pino({
  prettifier: await import('pino-colada'),
});

export default logger;
