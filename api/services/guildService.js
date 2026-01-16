import { NotFoundError, ConflictError } from "../middleware/error.js";

class guildService {
  constructor(db) {
    this.guild = db.Guild;
  }

  async create(id, name) {
    const guild = await this.guild.findByPk(id);

    if (guild) {
      throw new ConflictError(`Guild "${id}" already exists`);
    }

    const newGuild = await this.guild.create({ guildId: id });

    console.log(`Added server "${name}" to database`);
    return newGuild;
  }

  async getOne(id) {
    const guild = await this.guild.findByPk(id);

    if (!guild) {
      throw new NotFoundError(`Guild "${id}" not found`);
    }

    return guild;
  }

  async getAll() {
    const guilds = await this.guild.findAll();

    if (guilds.length <= 0) {
      throw new NotFoundError(`No guilds found`);
    }

    return guilds;
  }

  async delete(id, name) {
    const guild = await this.guild.findByPk(id);

    if (!guild) {
      throw new NotFoundError(`Guild "${id}" not found`);
    }

    await guild.destroy();

    console.log(
      `Removed server "${name}" from database and deleted all connected information`
    );
    return guild;
  }
}

export default guildService;
