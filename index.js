import { Client, Collection } from 'discord.js';
import { config } from 'dotenv';
import { Chalk } from 'chalk';
import mongoose from 'mongoose';
import fs from 'fs';
import intentOptions from './config/intentOptions.js';
import logger from './handlers/logHandler.js';
import deploySlashCommands from './deployCommands.js';

config();

console.clear();

const { MONGODB_URI, TOKEN } = process.env;

const chalk = new Chalk({ level: 2 });

const client = new Client({
  intents: intentOptions,
});

deploySlashCommands();

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
  if (process.env.NODE_ENV === 'production') {
    return chalk.yellow(
      'Running in production mode! Commands are registered globally.'
    );
  }
  return chalk.yellow(
    'Running in development mode! Commands are registered for the guild.'
  );
}

// Determine message to be logged
// once the bot has successfully connected
// to the Discord API
client.once('ready', () => {
  client.user.setActivity('/help', { type: 'PLAYING' });

  logger.info(determineStatus());

  logger.info(
    `${chalk.greenBright(
      `${chalk.blue('All set!')} Logged in as ${client.user.tag}!`
    )}
    `
  );
});

// Connect to MongoDB using the MONGO_URI
try {
  await mongoose.connect(MONGODB_URI);
  logger.info('Connected to MongoDB!');
} catch (err) {
  logger.error(err);
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

client.login(TOKEN);

export default client;
