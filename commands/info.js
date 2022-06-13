import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import ms from 'ms'; // Used to convert milliseconds to readable format

export const data = new SlashCommandBuilder()
  .setName('info')
  .setDescription('Get information about the bot.');

export async function execute(interaction) {
  const infoActionRow = new MessageActionRow().addComponents(
    new MessageButton()
      .setLabel('View Source Code')
      .setURL('https://github.com/savioxavier/discord-neofetch')
      .setStyle('LINK')
      .setEmoji('📃'),
    new MessageButton()
      .setLabel('Donate')
      .setURL('https://buymeacoffee.com/savioxavier')
      .setStyle('LINK')
      .setEmoji('☕')
  );

  const infoEmbed = new MessageEmbed()
    .setColor('#cd7b4a')
    .setAuthor({
      name: interaction.client.user.tag,
      iconURL: interaction.client.user.displayAvatarURL(),
    })
    .setThumbnail(interaction.client.user.avatarURL())
    .setTitle('Bot Info')
    .addField('ID', interaction.client.user.id)
    .addField('Uptime', ms(interaction.client.uptime, { long: true }))
    .addField('Ping', `${interaction.client.ws.ping} ms`)
    .addField('Language used', 'JavaScript')
    .addField('Created by', 'Skyascii#1860')
    .addField(
      'Like this bot?',
      'Consider starring the repo on [GitHub](https://github.com/savioxavier/discord-neofetch). Feeling generous? Consider [donating](https://buymeacoffee.com/savioxavier) to support development!'
    )
    .setTimestamp()
    .setFooter({
      text: 'neofetch bot',
      iconURL: interaction.client.user.displayAvatarURL(),
    });

  await interaction.reply({
    content: 'Some information about this cool bot:',
    embeds: [infoEmbed],
    components: [infoActionRow],
  });
}
