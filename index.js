import { Client, Collection } from 'discord.js';
import { config } from 'dotenv';
import chalk from 'chalk';
import fs from 'fs';
import intentOptions from './config/intentOptions.js';
import logger from './handlers/logHandler.js';

config();

console.clear();

const token = process.env.TOKEN;

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

// Determine message to be logged
// once the bot has successfully connected
// to the Discord API
client.once('ready', () => {
  client.user.setActivity('/help', { type: 'PLAYING' });

  logger.info(
    `${chalk.greenBright(
      `${chalk.blue('All set!')} Logged in as ${client.user.tag}!`
    )}
    `
  );
});

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

client.login(token);

export default client;
