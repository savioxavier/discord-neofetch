import { Chalk } from 'chalk';

const chalk = Chalk({ level: 2 });

const logger = {
  info: (message) => {
    console.log(chalk.green(message));
  },
  error: (message) => {
    console.error(chalk.red(message));
  },
};

export default logger;
