class GuildService {
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
      console.error(error);
    }
  }

  async delete(id) {
    try {
      const guild = await this.guild.findByPk(id);

      if (!guild) {
        console.error("Guild not found");
      }

      await guild.destroy();

      console.log(
        `Removed server with id ${id} from database and deleted all connected information`
      );
    } catch (error) {
      console.error(error);
    }
  }
}

export default GuildService;
