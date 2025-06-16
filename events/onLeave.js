const { Events } = require("discord.js");
const db = require("../models");
const guildService = new (require("../services/guildService"))(db);

module.exports = {
  name: Events.GuildDelete,
  execute(guild) {
    guildService.delete(guild.id, guild.name);
  },
};
