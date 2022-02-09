import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('invite')
  .setDescription('Invite the bot to your server!');

export async function execute(interaction) {
  const inviteEmbed = new MessageEmbed()
    .setColor('#cd7b4a')
    .setAuthor({
      name: interaction.client.user.tag,
      iconURL: interaction.client.user.displayAvatarURL(),
    })
    .setTitle("Here's your invite link!")
    .setDescription(
      `[Click here](https://discordapp.com/oauth2/authorize?client_id=${interaction.client.user.id}&scope=bot&permissions=8) to invite this bot to your server!`
    )
    .setTimestamp()
    .setFooter({
      text: 'neofetch bot',
      iconURL: interaction.client.user.displayAvatarURL(),
    });

  await interaction.reply({
    content: 'Invite the bot to your server:',
    embeds: [inviteEmbed],
  });
}
