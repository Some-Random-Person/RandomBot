const { toPlain } = require("../utility/toPlain");

class welcomeService {
  constructor(db) {
    this.welcome = db.Welcome;
    this.guild = db.Guild;
    this.option = db.Option;
  }

  async add(
    guildId,
    welcomeTitle,
    welcomeMessage,
    welcomeChannel,
    welcomeImageUrl,
    welcomeColor
  ) {
    try {
      const welcome = await this.welcome.findOne({
        where: { guildId },
      });

      if (welcome) {
        return "alreadyExists";
      }

      console.log(welcomeImageurl);

      const newWelcome = await this.welcome.create({
        guildId,
        welcomeTitle,
        welcomeMessage,
        welcomeChannel,
        welcomeImageUrl,
        welcomeColor,
      });

      return newWelcome;
    } catch (error) {
      console.error(error);
    }
  }

  async getWelcomeInfo(guildId) {
    try {
      const welcome = await this.welcome.findOne({
        where: { guildId: guildId },
        include: [
          {
            model: this.guild,
            include: [
              {
                model: this.option,
                where: { setting: "welcomeMessage", value: 1 },
                required: true,
              },
            ],
            required: true,
          },
        ],
      });

      return toPlain(welcome);
    } catch (error) {
      console.error(error);
    }
  }

  async update(
    guildId,
    welcomeTitle,
    welcomeMessage,
    welcomeChannel,
    welcomeImageUrl,
    welcomeColor
  ) {
    try {
      const welcome = await this.welcome.findOne({
        where: { guildId },
      });

      if (!welcome) {
        return "doesntExist";
      }

      const updatedWelcome = await welcome.update({
        welcomeTitle,
        welcomeMessage,
        welcomeChannel,
        welcomeImageUrl,
        welcomeColor,
      });

      return updatedWelcome;
    } catch (error) {
      console.error(error);
    }
  }

  async delete(guildId) {
    try {
      const welcome = await this.welcome.findOne({
        where: { guildId },
      });

      if (!welcome) {
        return "doesntExist";
      }

      await welcome.destroy();
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = welcomeService;
