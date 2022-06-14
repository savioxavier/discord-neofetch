import { SlashCommandBuilder } from '@discordjs/builders';
import { Chalk } from 'chalk';
import { stripIndents } from 'common-tags';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import stripAnsi from 'strip-ansi';
import { fileURLToPath } from 'node:url';
import logger from '../handlers/logHandler.js';
import getRandInt from '../helpers/getRandInt.js';
import getRandom from '../helpers/getRandom.js';
import distroDetails from '../utils/distros.js';
import embedColors from '../utils/embedColors.js';
import helpEmbed from '../utils/helpEmbed.js';
import prompts from '../utils/prompts.js';
import { DistroConfig, PromptConfig } from './neoconf.js';

const chalk = new Chalk({ level: 2 });

export const data = new SlashCommandBuilder()
  .setName('neofetch')
  .setDescription('Displays your Discord information - neofetch style.')
  .addUserOption((option) =>
    option
      .setName('target')
      .setRequired(false)
      .setDescription('The user to get the information of')
  );

const shell = (shellName) => getRandom(shellName);

export async function execute(interaction) {
  const user = interaction.options.getUser('target');

  const packages = getRandInt(75, 800);
  const cpu = getRandInt(25, 98);

  let details = {};
  let distro;
  let prompt;

  if (user) {
    // Get distro choice of the mentioned user from database. If it isn't available, set distro to 'discord'
    const distroConfig = await DistroConfig.findOne({
      userId: user.id,
    });

    distro = distroConfig ? distroConfig.distroChoice : 'discord';

    // Get prompt choice of the mentioned user from database. If it isn't available, set prompt to 'default'
    const promptConfig = await PromptConfig.findOne({
      userId: user.id,
    });

    prompt = promptConfig ? promptConfig.promptChoice : 'default';

    // Default details object, if user is specified
    details = {
      username: `${user.username}#${user.discriminator}`,
      id: user.id,
      createdAt: user.createdAt.toLocaleDateString(),
      isBot: user.bot ? 'Yes' : 'No',
    };
  } else {
    // Get distro choice of the current user from database. If it isn't available, set distro to 'discord'
    const distroConfig = await DistroConfig.findOne({
      userId: interaction.user.id,
    });

    distro = distroConfig ? distroConfig.distroChoice : 'discord';

    // Get prompt choice of the current user from database. If it isn't available, set prompt to 'default'
    const promptConfig = await PromptConfig.findOne({
      userId: interaction.user.id,
    });

    prompt = promptConfig ? promptConfig.promptChoice : 'default';

    // Default details object for the author, if user is not specified.
    details = {
      username: `${interaction.user.username}#${interaction.user.discriminator}`,
      id: interaction.user.id,
      createdAt: interaction.user.createdAt.toLocaleDateString(),
      isBot: interaction.bot ? 'Yes' : 'No',
    };
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  // Read file.txt and split on new lines
  const fileContents = fs
    .readFileSync(path.resolve(__dirname, `../assets/${distro}.txt`), 'utf8')
    .split(/[\n\r]+/);

  // Additional whitespace for the ascii arts
  // 'discord' is exempted as the ascii art is already too big
  const whitespace = distro !== 'discord' ? '  ' : '';

  // Distro specific details, provided by the distroDetails object
  const distroColor = distroDetails[distro].color;
  const distroName = distroDetails[distro].os;
  const distroPackageManager = distroDetails[distro].packageManager;
  const distroShells = distroDetails[distro].shells;

  // Prompt specific details, provided by the prompts object
  const currentPrompt = prompts[prompt];

  // Append five spaces to end of each element in fileContents.
  // This is to make the ascii art look nicer.
  const newFileContents = fileContents.map((line) =>
    chalk[distroDetails[distro].color](`${whitespace}${line}${whitespace}`)
  );

  // Replicates terminal colors that you would see
  // at the end of the neofetch command
  const termColors = `${chalk.blue('███')}${chalk.green('███')}${chalk.red('███')}${chalk.yellow('███')}${chalk.cyan('███')}${chalk.magenta('███')}${chalk.white('███')}`; // prettier-ignore

  // Since each ascii art has exactly 12 lines and 21 columns per line,
  // the userDetails object will be formatted to fit the ascii art
  const userDetails = [
    chalk.green(`${distroName}`),
    chalk.red('---------------------'),
    `${chalk[distroColor].bold('Username')}: ${details.username}`,
    `${chalk[distroColor].bold('ID')}: ${details.id}`,
    `${chalk[distroColor].bold('Created')}: ${details.createdAt}`,
    `${chalk[distroColor].bold('Is Bot')}: ${details.isBot}`,
    `${chalk[distroColor].bold('CPU Usage')}: ${cpu}%`,
    `${chalk[distroColor].bold('Shell')}: ${shell(distroShells)}`,
    `${chalk[distroColor].bold('Packages')}: ${packages} (${distroPackageManager})`, // prettier-ignore
    '',
    termColors,
  ];

  // Append each element of details object to each element of newFileContents
  const newDetails = newFileContents.map(
    (line, index) => `${line}${userDetails[index]}`
  );

  // Join all elements of newDetails with new lines
  const newFileContentsJoined = newDetails.join('\n');

  // Replace all 'undefined' (caused by unprovided details) with ''
  const newFileContentsJoinedReplaced = newFileContentsJoined.replace(
    /undefined/g,
    ''
  );

  // userDetails object, but for mobile
  // Does not contain ANSI colors
  // as they are not visible on mobile
  const userDetailsMobile = stripIndents`
    ${distroName}
    ---------------------
    >> Username: ${details.username}
    >> ID: ${details.id}
    >> Created: ${details.createdAt}
    >> Is Bot: ${details.isBot}
    >> CPU Usage: ${cpu}%
    >> Shell: ${shell(distroShells)}
    >> Packages: ${packages} (${distroPackageManager})
  `;

  // Main embed that a user sees on desktop
  // Contains ANSI colors
  const neofetchEmbed = new MessageEmbed()
    .setTitle(user ? `\`$ neofetch ${user.id}\`` : '`$ neofetch`')
    .setDescription(
      stripIndents`
      \`\`\`ansi
      ${currentPrompt} neofetch

      ${newFileContentsJoinedReplaced}

      \`\`\`
  `
    )
    .setFooter({
      text: 'Use /neoconf to configure',
      iconURL: interaction.user.avatarURL(),
    })
    .setColor(embedColors[distroColor])
    .setTimestamp();

  // Main embed that a user sees on mobile
  // Does not contain ANSI colors
  // as they are not visible on mobile
  const mobileEmbed = new MessageEmbed()
    .setTitle(
      user ? `\`$ neofetch ${user.id} --mobile\`` : '`$ neofetch --mobile`'
    )
    .setDescription(
      stripIndents`
      \`\`\`ansi
      ${stripAnsi(currentPrompt)}

      ${userDetailsMobile}

      \`\`\`
    `
    )
    .setColor(embedColors[distroColor])
    .setTimestamp()
    .setFooter({
      text: 'Use /neoconf to configure',
      iconURL: interaction.user.avatarURL(),
    });

  // Initialize new message button
  // On clicking this button, the embed will turn to mobile embed
  const actionRow = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId('neofetch-mobile')
      .setLabel('--mobile')
      .setStyle('SUCCESS')
      .setEmoji('📱'),
    new MessageButton()
      .setCustomId('neofetch-help')
      .setLabel('--help')
      .setStyle('PRIMARY')
      .setEmoji('❓'),
    new MessageButton()
      .setCustomId('neofetch-delete')
      .setLabel(':wq! (Delete)')
      .setStyle('DANGER')
      .setEmoji('❌')
  );

  // Disable action row
  // Prevents the user from interacting with the message
  // after the time limit has passed
  // (controlled by the buttonTimeout variable)
  const disabledActionRow = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId('neofetch-mobile')
      .setLabel('--mobile')
      .setStyle('SUCCESS')
      .setEmoji('📱')
      .setDisabled(true),
    new MessageButton()
      .setCustomId('neofetch-help')
      .setLabel('--help')
      .setStyle('PRIMARY')
      .setEmoji('❓')
      .setDisabled(true),
    new MessageButton()
      .setCustomId('neofetch-delete')
      .setLabel(':wq! (Delete)')
      .setStyle('DANGER')
      .setEmoji('❌')
      .setDisabled(true)
  );

  // Determines the time (in milliseconds)
  // after which the buttons will be disabled
  const millisecondsInASecond = 1000; // Why? Just because. Don't question.
  const buttonTimeout = 20 * millisecondsInASecond;

  const mobileButtonFilter = (action) =>
    action.customId === 'neofetch-mobile' &&
    action.user.id === interaction.user.id;

  const mobileButtonCollector =
    interaction.channel.createMessageComponentCollector({
      mobileButtonFilter,
      time: buttonTimeout,
    });

  mobileButtonCollector.on('collect', async (action) => {
    if (action.customId === 'neofetch-mobile') {
      try {
        await action.deferUpdate();
        await action.editReply({
          content: "Here's your neofetch in mobile mode!",
          embeds: [mobileEmbed],
        });
      } catch {
        // pass
      }
    }
  });

  const helpButtonFilter = (action) =>
    action.customId === 'neofetch-help' &&
    action.user.id === interaction.user.id;

  const helpButtonCollector =
    interaction.channel.createMessageComponentCollector({
      helpButtonFilter,
      time: buttonTimeout,
    });

  helpButtonCollector.on('collect', async (action) => {
    if (action.customId === 'neofetch-help') {
      try {
        await action.deferUpdate();
        await action.editReply({
          content: 'Here are some commands you can use with neofetch',
          embeds: [helpEmbed],
        });
      } catch {
        // pass
      }
    }
  });

  const deleteButtonFilter = (action) =>
    action.customId === 'neofetch-delete' &&
    action.user.id === interaction.user.id;
  const deleteButtonCollector =
    interaction.channel.createMessageComponentCollector({
      deleteButtonFilter,
      time: buttonTimeout,
    });

  deleteButtonCollector.on('collect', async (action) => {
    if (action.customId === 'neofetch-delete') {
      try {
        await action.deferUpdate();
        await action.deleteReply();
      } catch {
        // pass
      }
    }
  });

  // Random tips that appear on the main neofetch message
  let randomTips = [
    '⭐ Like the bot? Consider giving it a star on GitHub! [Click here](https://github.com/savioxavier/discord-neofetch).',
    '❓ You can use the `/help` command to get a list of commands.',
    '🌈 Feeling extra special? Consider donating to support development! [Click here](https://buymeacoffee.com/savioxavier).',
    '🎨 You can use the `/neoconf distro` command to configure the distro.',
    '🎨 You can use the `/neoconf prompt` command to configure the prompt.',
  ];

  // Append four empty strings elements to randomTips
  // This is ensure that the randomTips array
  // will not return tips every time
  randomTips = [...randomTips, Array.from({ length: 4 }).fill('')];
  const randomTipElement =
    randomTips[Math.floor(Math.random() * randomTips.length)];

  // Determine tip message
  // If the randomTipElement is empty,
  // then the tip message will be empty
  const randomTip =
    randomTipElement !== '' ? `\n**__TIP__**: ${randomTipElement}` : '';

  // Finally, reply with the actual neofetch message
  try {
    await interaction.reply({
      content: `Not on PC? Seeing weird text? Click on the **\`--mobile\`** button below instead.${randomTip}`,
      embeds: [neofetchEmbed],
      components: [actionRow],
    });
  } catch (error) {
    logger.error(error);
    await interaction.reply({
      content: 'Something went wrong. Please try the command again.',
      ephemeral: true,
    });
  }

  // Handlers to disable the action row
  // after the time limit has passed
  const masterCollector = mobileButtonCollector; // Can be any of the button collectors, since they all have the same timeout

  masterCollector.on('end', async () => {
    await interaction.editReply({
      components: [disabledActionRow],
    });
  });
}
