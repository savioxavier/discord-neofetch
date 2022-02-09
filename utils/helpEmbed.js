import { MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';

const helpEmbed = new MessageEmbed()
  .setColor('#cd7b4a')
  .setTitle('`$ neofetch --help`')
  .setDescription(
    `
    **Available commands for neofetch bot**:
    `
  )
  .addField(
    '• `/neofetch`',
    stripIndents`
> Displays your Discord information - neofetch style.
       
      **Usage**:
          \`/neofetch\`: Display your neofetch information.
          \`/neofetch <@user>\`: Display the neofetch information of the mentioned user.
    `
  )
  .addField(
    '• `/neomobile`',
    stripIndents`
> neofetch, but for mobile users.
       
      **Usage**:
          \`/neomobile\`: Display your neofetch mobile information.
          \`/neomobile <@user>\`: Display the neofetch mobile information of the mentioned user.
    `
  )
  .addField('• `/help`', '> Displays this message.')
  .addField(
    '• `/neoconf distro`',
    stripIndents`
> Displays the list of customizable distros.

      **Usage**:
          \`/neoconf distro <distroname>\`: Change your neofetch's ascii distro to the specified distro. Select the distro of your choice from the list. Defaults to 'discord', if no distro is specified.
    `
  )
  .addField(
    '• `/neoconf prompt`',
    stripIndents`
> Displays the list of customizable prompts.
      
      **Usage**:
          \`/neoconf prompt <promptname>\`: Change your neofetch's prompt to the specified prompt. Select the prompt of your choice from the list. Defaults to 'default', if no prompt is specified.
    `
  )
  .addField('• `/info`', '> Displays information about the bot.')
  .addField('• `/invite`', '> Displays the invite link for the bot.')
  .setTimestamp()
  .setFooter({
    text: 'neofetch bot',
  });

export default helpEmbed;
