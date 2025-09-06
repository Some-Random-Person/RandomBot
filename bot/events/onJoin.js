const { Events } = require("discord.js");
const db = require("../models");
const guildService = new (require("../services/guildService"))(db);

module.exports = {
  name: Events.GuildCreate,
  execute(guild) {
    guildService.create(guild.id, guild.name);
  },
};
