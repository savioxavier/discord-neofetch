import { Chalk } from 'chalk';

const chalk = Chalk({ level: 2 });

const prompts = {
  default: chalk.green(`discord ${chalk.blue('~$')}`),
  pristine: chalk.blue(`➜ discord git:(${chalk.red('master')})`),
  afmagic: chalk.blue(
    `~/discord(${chalk.green('master')}${chalk.yellow(' *')}) ${chalk.cyan(
      '>>'
    )}`
  ),
  candy: chalk.green(`discord [${chalk.green('master')} ${chalk.yellow('*')}]`),
  zap: chalk.blue(`➜ discord [${chalk.red('master')}] ⚡`),
  percent: chalk.green(`discord ${chalk.red('%')}`),
  wuffers: chalk.blue(`[master ${chalk.red('*')}] ${chalk.green('discord')}:`),
};

export default prompts;
