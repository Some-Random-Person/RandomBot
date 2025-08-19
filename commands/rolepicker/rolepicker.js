const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  PermissionsBitField,
  RoleSelectMenuBuilder,
  ActionRowBuilder,
  ComponentType,
  EmbedBuilder,
} = require("discord.js");

const db = require("../../models");

module.exports = {
  category: "rolepicker",
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("rolepicker")
    .setDescription("Create new role picker")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("role-title")
        .setDescription("The title for the role picker")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel for the role picker")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
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

    const roles = new RoleSelectMenuBuilder()
      .setCustomId("roleSelect")
      .setPlaceholder("Select a role")
      .setMinValues(1);

    const row = new ActionRowBuilder().addComponents(roles);

    const response = await interaction.reply({
      content: "Choose roles",
      components: [row],
      withResponse: true,
    });

    const collector = response.resource.message.createMessageComponentCollector(
      {
        componentType: ComponentType.RoleSelect,
        time: 3_600_000,
      }
    );

    collector.on("collect", async (i) => {
      const selection = i.values[0];
      const role = await i.guild.roles.fetch(selection);
      await i.reply({
        content: `${i.user} has selected ${role}!`,
        ephemeral: true,
      });
    });
  },
};
