const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");

const db = require("../../models");
const streamerService = new (require("../../services/streamerService"))(db);

module.exports = {
  category: "twitch",
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("twitch")
    .setDescription("Edit channels for Twitch notifications")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Adds a Twitch channel to notification list")
        .addStringOption((option) =>
          option
            .setName("twitch-channel")
            .setDescription("The twitch channel you want added")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send notifications to")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edit")
        .setDescription("Edit a Twitch channel in the notification list")
        .addStringOption((option) =>
          option
            .setName("twitch-channel")
            .setDescription("The twitch channel you want to edit")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send notifications to")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Removes a Twitch channel to notification list")
        .addStringOption((option) =>
          option
            .setName("twitch-channel")
            .setRequired(true)
            .setDescription("The twitch channel you want removed")
        )
    ),
  async execute(interaction) {
    const twitchChannel = interaction.options.getString("twitch-channel");
    const discordChannel = interaction.options.getChannel("channel");

    switch (interaction.options.getSubcommand()) {
      case "add":
        try {
          await streamerService.add(
            interaction.guild.id,
            twitchChannel,
            discordChannel.id
          );

          await interaction.reply(
            `Notifications for \`${twitchChannel}\` will be sent to ${discordChannel}`
          );
        } catch (error) {
          await interaction.reply({
            content: `Failed to add: ${error.message}`,
            ephemeral: true,
          });
        }
        break;
      case "edit":
        try {
          await streamerService.update(
            interaction.guild.id,
            twitchChannel,
            discordChannel.id
          );

          await interaction.reply(
            `Notifications for \`${twitchChannel}\` will be sent to ${discordChannel}`
          );
        } catch (error) {
          await interaction.reply({
            content: `Failed to edit: ${error.message}`,
            ephemeral: true,
          });
        }
        break;
      case "remove":
        try {
          await streamerService.delete(interaction.guild.id, twitchChannel);

          await interaction.reply(
            `\`${twitchChannel}\` removed from notification list`
          );
        } catch (error) {
          await interaction.reply({
            content: `Failed to remove: ${error.message}`,
            ephemeral: true,
          });
        }
        break;
      default:
        await interaction.reply({
          content: "Unknown subcommand.",
          ephemeral: true,
        });
        break;
        break;
    }
  },
};
