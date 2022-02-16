import { SlashCommandBuilder } from '@discordjs/builders';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import logger from '../handlers/logHandler.js';

config();

// Initialize two Schemas
// one for distros and one for prompts
const distroChoiceSchema = new mongoose.Schema({
  userId: String,
  distroChoice: String,
});
const promptChoiceSchema = new mongoose.Schema({
  userId: String,
  promptChoice: String,
});

// Create a model for each Schema
// Export them so they can be used in neofetch.js
export const DistroConfig = mongoose.model('DistroConfig', distroChoiceSchema);
export const PromptConfig = mongoose.model('PromptConfig', promptChoiceSchema);

export const data = new SlashCommandBuilder()
  .setName('neoconf')
  .setDescription('View and configure your neofetch data.')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('distro')
      .setDescription('Configure your current distro.')
      .addStringOption((option) =>
        option
          .setName('distro')
          .setDescription('The distro to set.')
          .setRequired(true)
          .addChoice('Discord', 'discord')
          .addChoice('Arch Linux', 'arch')
          .addChoice('Fedora', 'fedora')
          .addChoice('Manjaro', 'manjaro')
          .addChoice('Mint', 'mint')
          .addChoice('Pop!_OS', 'popos')
          .addChoice('Ubuntu', 'ubuntu')
          .addChoice('Android', 'android')
          .addChoice('CentOS', 'centos')
          .addChoice('Debian', 'debian')
          .addChoice('Elementary', 'elementary')
          .addChoice('Gentoo', 'gentoo')
          .addChoice('MacOS', 'macos')
          .addChoice('Windows', 'windows')
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('prompt')
      .setDescription('Configure your current prompt.')
      .addStringOption((option) =>
        option
          .setName('prompt')
          .setDescription('The prompt to set.')
          .setRequired(true)
          .addChoice('Default', 'default')
          .addChoice('Pristine', 'pristine')
          .addChoice('AFMagic', 'afmagic')
          .addChoice('Candy', 'candy')
          .addChoice('Zap', 'zap')
          .addChoice('Percent', 'percent')
          .addChoice('Wuffers', 'wuffers')
      )
  );

export async function execute(interaction) {
  if (interaction.options.getSubcommand() === 'distro') {
    // Distro configuration
    const newDistro = interaction.options.getString('distro');

    // Save the new distro choice to database
    const distroConfig = new DistroConfig({
      userId: interaction.user.id,
      distroChoice: newDistro,
    });

    // If user already exists in database, update their distro choice
    const existingDistroConfig = await DistroConfig.findOne({
      userId: interaction.user.id,
    });

    if (existingDistroConfig) {
      try {
        existingDistroConfig.distroChoice = newDistro;
        existingDistroConfig.save();

        logger.info(
          `Updated distro choice for user ${interaction.user.id} to ${newDistro}`
        );

        await interaction.reply({
          content: `Successfully updated distro choice to \`${newDistro}\`!`,
          ephemeral: true,
        });
      } catch (err) {
        logger.error(err);
        await interaction.reply({
          content: 'Something went wrong trying to update your distro choice.',
          ephemeral: true,
        });
      }
    }

    // If user doesn't exist in database, create new user
    else {
      try {
        distroConfig.save();

        logger.info(
          `Created new distro choice for user ${interaction.user.id} to ${newDistro}`
        );

        await interaction.reply({
          content: `Successfully set distro choice to \`${newDistro}\`!`,
          ephemeral: true,
        });
      } catch (err) {
        logger.error(err);
        await interaction.reply({
          content: 'Something went wrong trying to create your distro choice.',
          ephemeral: true,
        });
      }
    }
  } else if (interaction.options.getSubcommand() === 'prompt') {
    // Prompt configuration
    const newPrompt = interaction.options.getString('prompt');

    // Save the new prompt choice to database
    const promptConfig = new PromptConfig({
      userId: interaction.user.id,
      promptChoice: newPrompt,
    });

    // If user already exists in database, update their prompt choice
    const existingPromptConfig = await PromptConfig.findOne({
      userId: interaction.user.id,
    });

    if (existingPromptConfig) {
      try {
        existingPromptConfig.promptChoice = newPrompt;
        existingPromptConfig.save();

        logger.info(
          `Updated prompt choice for user ${interaction.user.id} to ${newPrompt}`
        );

        await interaction.reply({
          content: `Successfully updated prompt choice to \`${newPrompt}\`!`,
          ephemeral: true,
        });
      } catch (err) {
        logger.error(err);
        await interaction.reply({
          content: 'Something went wrong trying to update your prompt choice.',
          ephemeral: true,
        });
      }
    }

    // If user doesn't exist in database, create new user
    else {
      try {
        promptConfig.save();

        logger.info(
          `Created new prompt choice for user ${interaction.user.id} to ${newPrompt}`
        );

        await interaction.reply({
          content: `Successfully set prompt choice to \`${newPrompt}\`!`,
          ephemeral: true,
        });
      } catch (err) {
        logger.error(err);
        await interaction.reply({
          content: 'Something went wrong trying to create your prompt choice.',
          ephemeral: true,
        });
      }
    }
  }
}
