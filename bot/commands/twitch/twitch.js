const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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
        .setName("get")
        .setDescription(
          "Gets a list of all Twitch channels in the notification list"
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
    // Check for Administrator permission
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return interaction.reply({
        content:
          "You need the **Administrator** permission to use this command.",
        flags: MessageFlags.Ephemeral,
      });
    }

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
            flags: MessageFlags.Ephemeral,
          });
        }
        break;
      case "get":
        try {
          await interaction.deferReply();

          const streamers = await streamerService.getAllGuild(
            interaction.guild.id
          );

          const chunkSize = 12;
          const pages = [];

          for (let index = 0; index < streamers.length; index += chunkSize) {
            const currentChunk = streamers.slice(index, index + chunkSize);

            const embed = new EmbedBuilder()
              .setColor("#0099ff")
              .setTitle(
                `All streamers notifications are on for (page ${
                  pages.length + 1
                })`
              );

            for (const streamer of currentChunk) {
              embed.addFields({
                name: streamer.dataValues.streamerName,
                value: `<#${streamer.dataValues.channelId}>`,
                inline: true,
              });
            }

            pages.push(embed);
          }

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("previous")
              .setLabel("Previous")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("next")
              .setLabel("Next")
              .setStyle(ButtonStyle.Primary)
          );

          let currentPage = 0;
          const message = await interaction.editReply({
            embeds: [pages[currentPage]],
            components: [row],
          });

          const collector = message.createMessageComponentCollector({
            time: 120000,
          });

          collector.on("collect", async (i) => {
            if (i.user.id !== interaction.user.id) {
              await i.reply({
                content: "You can't interact with this.",
                flags: MessageFlags.Ephemeral,
              });
              return;
            }

            if (i.customId === "previous") {
              currentPage =
                currentPage > 0 ? currentPage - 1 : pages.length - 1;
            } else if (i.customId === "next") {
              currentPage =
                currentPage + 1 < pages.length ? currentPage + 1 : 0;
            }

            await i.update({ embeds: [pages[currentPage]] });
          });

          collector.on("end", () => {
            row.components.forEach((button) => button.setDisabled(true));
            message.edit({ components: [row] });
          });
        } catch (error) {
          console.log(error);
          await interaction.reply({
            content: `Failed to edit: ${error.message}`,
            flags: MessageFlags.Ephemeral,
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
            flags: MessageFlags.Ephemeral,
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
            flags: MessageFlags.Ephemeral,
          });
        }
        break;
      default:
        await interaction.reply({
          content: "Unknown subcommand.",
          flags: MessageFlags.Ephemeral,
        });
        break;
    }
  },
};
