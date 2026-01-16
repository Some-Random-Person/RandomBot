class guildService {
  constructor(db) {
    this.guild = db.Guild;
  }

  async create(id, name) {
    try {
      const guild = await this.guild.findByPk(id);

      if (guild) {
        // add proper error handling - conflict error
        console.error(`Guild "${id}" already exists`);
      }

      const newGuild = await this.guild.create({ guildId: id });

      console.log(`Added server "${name}" to database`);
      return newGuild;
    } catch (error) {
      console.error(error);
    }
  }

  async getOne(id) {
    try {
      const guild = await this.guild.findByPk(id);

      if (!guild) {
        // add proper error handling - notfound error
        console.error(`Guild "${id}" not found`);
        return;
      }

      return guild;
    } catch (error) {
      console.error(error);
    }
  }

  async getAll() {
    try {
      const guilds = await this.guild.findAll();

      if (guilds.length <= 0) {
        // add proper error handling - notfound error
        console.error(`No brands found`);
        return;
      }

      return guilds;
    } catch (error) {
      console.error(error);
    }
  }

  async delete(id, name) {
    try {
      const guild = await this.guild.findByPk(id);

      if (!guild) {
        // add proper error handling - notfound error
        console.error(`Guild "${id}" not found`);
      }

      await guild.destroy();

      console.log(
        `Removed server "${name}" from database and deleted all connected information`
      );
      return guild;
    } catch (error) {
      console.error(error);
    }
  }
}

export default guildService;
