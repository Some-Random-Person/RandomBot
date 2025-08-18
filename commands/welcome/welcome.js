const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  PermissionsBitField,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

const db = require("../../models");
const welcomeService = new (require("../../services/welcomeService"))(db);
const { formatMessage } = require("../../utility/formatMessage");

module.exports = {
  category: "welcome",
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Edit welcome message")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(
      (subcommand) =>
        subcommand
          .setName("add")
          .setDescription("Adds a welcome message to the server")
      // .addStringOption((option) =>
      //   option
      //     .setName("welcome-title")
      //     .setDescription("The title of the welcome message")
      //     .setRequired(true)
      // )
      // .addStringOption((option) =>
      //   option
      //     .setName("welcome-message")
      //     .setDescription("The message for the welcome message")
      //     .setRequired(true)
      // )
      // .addChannelOption((option) =>
      //   option
      //     .setName("channel")
      //     .setDescription("The channel to send welcome message in")
      //     .setRequired(true)
      //     .addChannelTypes(ChannelType.GuildText)
      // )
      // .addStringOption((option) =>
      //   option
      //     .setName("image-url")
      //     .setDescription(
      //       "The URL to an image you want included in the embed"
      //     )
      // )
      // .addStringOption((option) =>
      //   option
      //     .setName("welcome-color")
      //     .setDescription("Hex code to the color you want the embed to be")
      // )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edit")
        .setDescription("Edits the server's welcome message")
        .addStringOption((option) =>
          option
            .setName("welcome-title")
            .setDescription("The title of the welcome message")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("welcome-message")
            .setDescription("The message for the welcome message")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send welcome message in")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addStringOption((option) =>
          option
            .setName("image-url")
            .setDescription(
              "The URL to an image you want included in the embed"
            )
        )
        .addStringOption((option) =>
          option
            .setName("welcome-color")
            .setDescription("Hex code to the color you want the embed to be")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Deletes the welcome message from the server")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("get")
        .setDescription("Gets the welcome message for the server")
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

    const welcomeTitle = interaction.options.getString("welcome-title");
    const welcomeMessage = interaction.options.getString("welcome-message");
    const discordChannel = interaction.options.getChannel("channel");
    const welcomeImageUrl = interaction.options.getString("image-url");
    const welcomeColor = interaction.options.getString("welcome-color");

    switch (interaction.options.getSubcommand()) {
      case "add":
        const modal = new ModalBuilder()
          .setCustomId("pingModal")
          .setTitle("Welcome message");

        const titleInput = new TextInputBuilder()
          .setCustomId("welcome-title")
          .setLabel("Welcome title")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder("Welcome!")
          .setRequired(true);

        const messageInput = new TextInputBuilder()
          .setCustomId("welcome-message")
          .setLabel("Welcome message")
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder("Welcome to the server..")
          .setRequired(true);

        const titleActionRow = new ActionRowBuilder().addComponents(titleInput);
        const messageActionRow = new ActionRowBuilder().addComponents(
          messageInput
        );

        modal.addComponents(titleActionRow, messageActionRow);

        await interaction.showModal(modal);
        break;
      case "edit":
        try {
          const welcome = await welcomeService.update(
            interaction.guild.id,
            welcomeTitle,
            welcomeMessage,
            discordChannel.id,
            welcomeImageUrl,
            welcomeColor
          );

          if (welcome == "doesntExist") {
            await interaction.reply({
              content:
                "Welcome message doesn't exist for this server, try adding one instead",
              ephemeral: true,
            });
            break;
          }

          await interaction.reply(
            `Welcome message with title ${welcomeTitle} will be sent to ${discordChannel}`
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
          const welcome = await welcomeService.delete(interaction.guild.id);

          if (welcome == "doesntExist") {
            await interaction.reply({
              content: "Welcome message doesn't exist for this server",
              ephemeral: true,
            });
            break;
          }

          await interaction.reply(
            `Welcome message with title \`${welcomeTitle}\` has been removed`
          );
        } catch (error) {
          await interaction.reply({
            content: `Failed to remove: ${error.message}`,
            ephemeral: true,
          });
        }
        break;
      case "get":
        try {
          const welcomeInfo = await welcomeService.getWelcomeInfo(
            interaction.guild.id
          );

          if (!welcomeInfo) {
            await interaction.reply({
              content: "Welcome message doesn't exist for this server",
              ephemeral: true,
            });
            break;
          }

          const channelId = welcomeInfo.welcomeChannel;
          const welcomeMessage = welcomeInfo.welcomeMessage;
          const welcomeTitle = welcomeInfo.welcomeTitle;
          const welcomeImage = welcomeInfo.welcomeImageUrl;
          const welcomeColor = welcomeInfo.welcomeColor;

          const channel = await interaction.guild.channels.fetch(channelId);
          const member = interaction.member;

          const message = formatMessage(welcomeMessage, member);
          const title = formatMessage(welcomeTitle, member);

          const embed = new EmbedBuilder()
            .setColor(welcomeColor)
            .setTitle(`${title}`)
            .setThumbnail("https://cdn.discordapp.com/embed/avatars/1.png")
            .setDescription(`${message}`)
            .setImage(welcomeImage);

          const commandChannel = interaction.channel;

          if (commandChannel && commandChannel.isTextBased()) {
            await interaction.reply({
              content: `Welcome message will be sent to ${channel}, this preview uses the person issuing the command as placeholder`,
              embeds: [embed],
            });
          } else {
            console.error(
              `Channel with ID ${channelId} not found, or is not a text based channel`
            );
          }
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: `Failed to get: ${error.message}`,
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
    }
  },
};
