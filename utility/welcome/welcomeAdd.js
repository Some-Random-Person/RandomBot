const db = require("../../models");
const welcomeService = new (require("../../services/welcomeService"))(db);
const { formatMessage } = require("../../utility/formatMessage");
const {
  ChannelType,
  PermissionFlagsBits,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

async function welcomeAdd(interaction) {
  const welcomeTitle = interaction.fields.getTextInputValue("welcome-title");
  const welcomeMessage =
    interaction.fields.getTextInputValue("welcome-message");
  const discordChannel = interaction.fields.getTextInputValue("channel");
  const welcomeImageUrl = interaction.fields.getTextInputValue("image-url");
  const welcomeColor = interaction.fields.getTextInputValue("welcome-color");

  try {
    const welcome = await welcomeService.add(
      interaction.guildId,
      welcomeTitle,
      welcomeMessage,
      discordChannel.id,
      welcomeImageUrl,
      welcomeColor
    );

    if (welcome == "alreadyExists") {
      await interaction.reply({
        content:
          "Welcome message already exists for this server, try editing instead",
        ephemeral: true,
      });
    }

    await interaction.reply(
      `Welcome message with title ${welcomeTitle} will be sent to ${discordChannel}`
    );
  } catch (error) {
    await interaction.reply({
      content: `Failed to add: ${error.message}`,
      ephemeral: true,
    });
  }
}

module.exports = { welcomeAdd };
