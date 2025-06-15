class guildService {
  constructor(db) {
    this.guild = db.Guild;
  }

  async create(id, name) {
    try {
      const guild = await this.guild.findOne({
        where: { id },
      });

      if (guild) {
        console.error(`Guild "${id}" already exists`);
      }

      await this.guild.create({
        id,
      });

      console.log(`Added server ${name} to database`);
    } catch (error) {
      throw error;
    }
  }

  async delete(id, name) {
    try {
      const guild = await this.guild.findByPk(id);

      if (!guild) {
        console.error("Guild not found");
      }

      await guild.destroy();

      console.log(
        `Removed server ${name} from database and deleted all connected information`
      );
    } catch (error) {
      console.error;
    }
  }
}

module.exports = guildService;
