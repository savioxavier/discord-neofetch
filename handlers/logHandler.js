import chalk from 'chalk';

const logger = {
  info: (message) => {
    console.log(chalk.green(message));
  },
  error: (message) => {
    console.error(chalk.red(message));
  },
};

export default logger;
