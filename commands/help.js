import { SlashCommandBuilder } from '@discordjs/builders';
import helpEmbed from '../utils/helpEmbed.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('List commands for neofetch bot.');

export async function execute(interaction) {
  await interaction.reply({
    content: 'Available commands for neofetch bot:',
    embeds: [helpEmbed],
  });
}
