import { NotFoundError, ConflictError } from "../middleware/error.js";
import toPlain from "../utility/toPlain.js";

class guildService {
  constructor(db) {
    this.guild = db.Guild;
  }

  async create(id) {
    const guild = await this.guild.findByPk(id);

    if (guild) {
      throw new ConflictError(`Guild "${id}" already exists`);
    }

    const newGuild = await this.guild.create({ guildId: id });

    return toPlain(newGuild);
  }

  async getOne(id) {
    const guild = await this.guild.findByPk(id);

    if (!guild) {
      throw new NotFoundError(`Guild "${id}" not found`);
    }

    return toPlain(guild);
  }

  async getAll() {
    const guilds = await this.guild.findAll();

    if (guilds.length <= 0) {
      throw new NotFoundError(`No guilds found`);
    }

    return toPlain(guilds);
  }

  async delete(id) {
    const guild = await this.guild.findByPk(id);

    if (!guild) {
      throw new NotFoundError(`Guild "${id}" not found`);
    }

    await guild.destroy();

    return toPlain(guild);
  }
}

export default guildService;
