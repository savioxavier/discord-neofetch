import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';
import fs from 'node:fs';
import logger from './handlers/logHandler.js';

dotenv.config();

const { CLIENT_ID, GUILD_ID, TOKEN } = process.env;

const commands = [];
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  // eslint-disable-next-line no-await-in-loop
  const command = await import(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(TOKEN);

async function deploySlashCommands() {
  const { NODE_ENV } = process.env;

  // Register commands globally if NODE_ENV is 'production'
  // otherwise register commands only for the guild
  if (NODE_ENV === 'production') {
    try {
      await rest.put(Routes.applicationCommands(CLIENT_ID), {
        body: commands,
      });
      logger.info(
        'Successfully registered application (/) commands in production mode!'
      );
    } catch (error) {
      logger.error(error);
    }
  } else {
    try {
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: commands,
      });
      logger.info(
        'Successfully registered application (/) commands in development mode!'
      );
    } catch (error) {
      logger.error(error);
    }
  }
}

deploySlashCommands();
