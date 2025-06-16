const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  category: "utility",
  devOnly: true,
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloads a command.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command to reload.")
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

    const commandName = interaction.options
      .getString("command", true)
      .toLowerCase();
    const command = interaction.client.commands.get(commandName);

    if (!command) {
      return interaction.reply(
        `There is no command with name \`${commandName}\`!`
      );
    }

    delete require.cache[
      require.resolve(`../${command.category}/${command.data.name}.js`)
    ];

    try {
      const newCommand = require(`../${command.category}/${command.data.name}.js`);
      interaction.client.commands.set(newCommand.data.name, newCommand);
      await interaction.reply(
        `Command \`${newCommand.data.name}\` was reloaded!`
      );
    } catch (error) {
      console.error(error);
      await interaction.reply(
        `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``
      );
    }
  },
};
