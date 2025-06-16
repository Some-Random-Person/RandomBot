const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");

const db = require("../../models");
const optionService = new (require("../../services/optionService"))(db);

module.exports = {
  category: "utility",
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("options")
    .setDescription("Sets the channel for Twitch notifications")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("setting")
        .setDescription("The setting you want to update")
        .setRequired(true)
        .addChoices(
          {
            name: "twitchNotifications",
            value: "twitchNotification",
          },
          {
            name: "welcomeMessage",
            value: "welcomeMessage",
          }
        )
    )
    .addBooleanOption((option) =>
      option
        .setName("on_off")
        .setDescription("Turn the option on or off")
        .setRequired(true)
    ),
  async execute(interaction) {
    // Check for Administrator permission
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return interaction.reply({
        content:
          "You need the **Administrator** permission to use this command.",
        ephemeral: true,
      });
    }

    const setting = interaction.options.getString("setting");
    const onOff = interaction.options.getBoolean("on_off");
    const serverId = interaction.guildId;

    optionService.update(serverId, setting, onOff);

    await interaction.reply(
      `Setting **${setting}** has been turned **${onOff ? "on" : "off"}**.`
    );
  },
};
