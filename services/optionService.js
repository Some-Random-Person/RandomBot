class optionService {
  constructor(db) {
    this.option = db.Option;
  }

  async create(guildId, setting, value) {
    try {
      const option = await this.option.findOne({
        where: { guildId, setting },
      });

      if (option) {
        const updatedOption = option.update({ setting, value });

        return updatedOption;
      }

      const newOption = await this.option.create({
        guildId,
        setting,
        value,
      });

      return newOption;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllWithSetting(setting, value) {
    try {
      const guildIds = await this.option.findAll({
        where: { setting, value },
        attributes: ["guildId"],
      });

      return guildIds;
    } catch (error) {
      console.error(error);
    }
  }

  async update(guildId, setting, value) {
    try {
      const option = await this.option.findOne({
        where: { guildId, setting },
      });

      if (!option) {
        const newOption = await this.option.create({
          guildId,
          setting,
          value,
        });

        return newOption;
      }

      const updatedOption = option.update({ setting, value });

      return updatedOption;
    } catch (error) {
      console.error(error);
    }
  }

  async delete(guildId, setting) {
    try {
      const option = await this.option.findOne({ where: { guildId, setting } });

      if (!option) {
        console.error("Option not found");
      }

      await option.destroy();
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = optionService;
