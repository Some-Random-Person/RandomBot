const { REST, Routes } = require("discord.js");
require("dotenv").config();
// const { clientId, guildId, token } = require("./config/config.json");
const fs = require("node:fs");
const path = require("node:path");

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // Clear existing global commands
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: [],
    });

    // Prepare commands for global registration, defining and excluding guild specifc commands
    const guildCommands = ["reload"];
    const globalCommands = commands.filter(
      (cmd) => !guildCommands.includes(cmd.name)
    );

    // Register all other commands globally
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: globalCommands,
    });

    // Find and register guild-specific commands
    const reloadGuildCommands = commands.filter((cmd) =>
      guildCommands.includes(cmd.name)
    );

    if (reloadGuildCommands) {
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID
        ),
        {
          body: reloadGuildCommands,
        }
      );
    }

    console.log(
      `Successfully reloaded ${globalCommands.length} global and ${reloadGuildCommands.length} guild-specific application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
