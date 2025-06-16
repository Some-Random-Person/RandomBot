const { Events, EmbedBuilder } = require("discord.js");
const db = require("../models");
const welcomeService = new (require("../services/welcomeService"))(db);

function formatMessage(template, member) {
  const replacements = {
    "{username}": member.user.username,
    "{mention}": member.user,
    "{server}": member.guild.name,
    "{linebreak}": "\n",
  };

  return template.replace(/{\w+}/g, (match) => replacements[match] || match);
}

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    try {
      const welcomeInfo = await welcomeService.getWelcomeInfo(member.guild.id);
      if (!welcomeInfo) return; // just stops the code if there is no welcomeInfo

      const client = member.client;
      const channelId = welcomeInfo.welcomeChannel;
      const welcomeMessage = welcomeInfo.welcomeMessage;
      const welcomeTitle = welcomeInfo.welcomeTitle;
      const welcomeImage = welcomeInfo.welcomeImageUrl;
      const welcomeColor = welcomeInfo.welcomeColor;

      const channel = await client.channels.fetch(channelId);

      const message = formatMessage(welcomeMessage, member);
      const title = formatMessage(welcomeTitle, member);

      const embed = new EmbedBuilder()
        .setColor(welcomeColor)
        .setTitle(`${title}`)
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(`${message}`)
        .setImage(welcomeImage);

      if (channel && channel.isTextBased()) {
        channel.send({
          embeds: [embed],
        });
      } else {
        console.error(
          `Channel with ID ${channelId} not found, or is not a text based channel`
        );
      }
    } catch (error) {
      console.error("Error in GuildMemberAdd event:", error);
    }
  },
};
