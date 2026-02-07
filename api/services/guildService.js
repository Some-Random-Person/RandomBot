import { NotFoundError, ConflictError } from "../middleware/error.js";
import toPlain from "../utility/toPlain.js";

class guildService {
  constructor(db) {
    this.guild = db.Guild;
    this.guildOption = db.GuildOption;
    this.option = db.Option;
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

  /* ------ GuildOptions ------ */

  async addGuildOptions(id) {
    const options = await this.option.findAll();
    const guildOptionsArr = [];

    await Promise.allSettled(
      options.map(async (option) => {
        const guildOption = await this.guildOption.findAll({
          where: { guildId: id, optionId: option.optionId },
        });

        if (guildOption.length > 0) {
          guildOptionsArr.push(guildOption);
        } else {
          const newGuildOption = await this.guildOption.create({
            guildId: id,
            optionId: option.optionId,
            value: false,
          });

          guildOptionsArr.push(newGuildOption);
        }
      }),
    );

    return toPlain(guildOptionsArr);
  }

  async getAllGuildOption(guildId) {
    const guildOptions = await this.guildOption.findAll({
      where: {
        guildId,
      },
    });

    if (guildOptions.length <= 0) {
      throw new NotFoundError(`Options for guild "${guildId}" not found`);
    }

    return toPlain(guildOptions);
  }

  async getGuildOption(guildId, optionId) {
    const guildOption = await this.guildOption.findOne({
      where: { guildId, optionId },
    });

    if (!guildOption) {
      throw new NotFoundError(
        `Option "${optionId}" for guild "${guildId}" not found`,
      );
    }

    return toPlain(guildOption);
  }

  async updateGuildOption(guildId, optionId, value) {
    const guildOption = await this.guildOption.findOne({
      where: { guildId, optionId },
    });

    if (!guildOption) {
      throw new NotFoundError(
        `Option "${optionId}" for guild "${guildId}" not found`,
      );
    }

    const updatedGuildOption = await guildOption.update({ value });

    return toPlain(updatedGuildOption);
  }
}

export default guildService;
