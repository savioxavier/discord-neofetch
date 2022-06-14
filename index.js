import boxen from 'boxen';
import { Chalk } from 'chalk';
import { stripIndents } from 'common-tags';
import { Client, Collection } from 'discord.js';
import { config } from 'dotenv';
import fs from 'node:fs';
import mongoose from 'mongoose';
import intentOptions from './config/intentOptions.js';
import logger from './handlers/logHandler.js';

config();

console.clear();

const { MONGODB_URI, TOKEN, NODE_ENV } = process.env;

const chalk = new Chalk({ level: 2 });

const client = new Client({
  intents: intentOptions,
});

// Read all files under /commands directory
// and add them to the client's command handler
client.commands = new Collection();
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  // eslint-disable-next-line no-await-in-loop
  const command = await import(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Check if NODE_ENV is 'production' and log messages as appropriate
function determineStatus() {
  if (NODE_ENV === 'production') {
    return chalk.yellow(
      `${chalk.bgCyan.black(
        ' PROD '
      )} Running in production mode! Commands are registered globally.`
    );
  }
  return chalk.yellow(
    `${chalk.bgYellow.black(
      ' DEV '
    )} Running in development mode! Commands are registered for the guild.`
  );
}

// Determine message to be logged
// once the bot has successfully connected
// to the Discord API
client.once('ready', () => {
  client.user.setActivity('/help', { type: 'PLAYING' });

  const commandsList = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js'))
    .map((file) => file.replace('.js', ''))
    .map((file) => chalk.cyan(`/${file}`))
    .join(', ');

  const commandsCount = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js')).length;

  logger.info(determineStatus());

  logger.info(
    boxen(
      stripIndents`${chalk.greenBright(
        `${chalk.blue('All set!')} Logged in as ${client.user.tag}!`
      )}

        ${chalk.yellow(`${commandsCount} commands loaded:`)}
        ${commandsList}
        `,
      {
        padding: 1,
        margin: 1,
        borderColor: 'green',
        borderStyle: 'round',
      }
    )
  );
});

// Connect to MongoDB using the MONGO_URI
try {
  await mongoose.connect(MONGODB_URI);
  logger.info('Connected to MongoDB!');
} catch (error) {
  logger.error(error);
}

// Handle all interactions with the bot
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(error);
    await interaction.reply({
      content:
        'Something went horribly wrong trying to execute that command. Perhaps the Unix gods do not favor you...',
      ephemeral: true,
    });
  }
});

// Due to reasons I couldn't understand,
// the bot would crash randomly when a user
// tried to interact with buttons
// I wasn't able to fix it, so I decided to do this
// The below "fix" is a temperory workaround,
// designed to prevent that from happening
process.on('unhandledRejection', (error) => {
  if (error.name === 'DiscordAPIError') {
    logger.error(
      '[temp err]: an unknown message error occured, ignore for now'
    );
  } else {
    logger.error(error);
  }
});

client.login(TOKEN);

export default client;
