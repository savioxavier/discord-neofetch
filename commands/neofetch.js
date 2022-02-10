import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { Chalk } from 'chalk';
import distroDetails from '../utils/distros.js';
import prompts from '../utils/prompts.js';
import embedColors from '../utils/embedColors.js';
import getRandInt from '../helpers/getRandInt.js';
import getRandom from '../helpers/getRandom.js';
import { DistroConfig, PromptConfig } from './neoconf.js';

const chalk = Chalk({ level: 2 });

export const data = new SlashCommandBuilder()
  .setName('neofetch')
  .setDescription('Displays your Discord information - neofetch style.')
  .addUserOption((option) =>
    option
      .setName('target')
      .setRequired(false)
      .setDescription('The user to get the information of')
  );

export async function execute(interaction) {
  const user = interaction.options.getUser('target');

  const shell = (shellName) => getRandom(shellName);

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

    if (distroConfig) {
      distro = distroConfig.distroChoice;
    } else {
      distro = 'discord';
    }

    // Get prompt choice of the mentioned user from database. If it isn't available, set prompt to 'default'
    const promptConfig = await PromptConfig.findOne({
      userId: user.id,
    });

    if (promptConfig) {
      prompt = promptConfig.promptChoice;
    } else {
      prompt = 'default';
    }

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

    if (distroConfig) {
      distro = distroConfig.distroChoice;
    } else {
      distro = 'discord';
    }

    // Get prompt choice of the current user from database. If it isn't available, set prompt to 'default'
    const promptConfig = await PromptConfig.findOne({
      userId: interaction.user.id,
    });

    if (promptConfig) {
      prompt = promptConfig.promptChoice;
    } else {
      prompt = 'default';
    }

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
    .split(/[\r\n]+/);

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
      iconURL: interaction.client.user.avatarURL(),
    })
    .setColor(embedColors[distroColor])
    .setTimestamp();

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
  randomTips = randomTips.concat(Array(4).fill(''));
  const randomTipElement =
    randomTips[Math.floor(Math.random() * randomTips.length)];

  // Determine tip message
  // If the randomTipElement is empty,
  // then the tip message will be empty
  const randomTip =
    randomTipElement !== '' ? `\n**__TIP__**: ${randomTipElement}` : '';

  // Finally, reply with the actual neofetch message
  await interaction.reply({
    content: `Not on PC? Seeing weird text? Try the **\`/neomobile\`** command instead.${randomTip}`,
    embeds: [neofetchEmbed],
  });
}
