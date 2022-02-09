import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';
import stripAnsi from 'strip-ansi';
import distroDetails from '../utils/distros.js';
import prompts from '../utils/prompts.js';
import embedColors from '../utils/embedColors.js';
import getRandInt from '../helpers/getRandInt.js';
import getRandom from '../helpers/getRandom.js';
import { DistroConfig, PromptConfig } from './neoconf.js';

export const data = new SlashCommandBuilder()
  .setName('neomobile')
  .setDescription('neofetch - but for mobile users.')
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

  // Distro specific details, provided by the distroDetails object
  const distroColor = distroDetails[distro].color;
  const distroName = distroDetails[distro].os;
  const distroPackageManager = distroDetails[distro].packageManager;
  const distroShells = distroDetails[distro].shells;

  // Prompt specific details, provided by the prompts object
  const currentPrompt = prompts[prompt];

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
      ${stripAnsi(currentPrompt)} neofetch

      ${userDetailsMobile}

      \`\`\`
    `
    )
    .setColor(embedColors[distroColor])
    .setTimestamp()
    .setFooter({
      text: 'Use /neoconf to configure',
      iconURL: interaction.client.user.avatarURL(),
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
    embeds: [mobileEmbed],
  });
}
