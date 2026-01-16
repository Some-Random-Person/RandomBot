import { ConflictError, NotFoundError } from "../middleware/error.js";
import toPlain from "../utility/toPlain.js";
import { Op } from "sequelize";
const twitchDelayMinutes = parseInt(process.env.TWITCH_DELAY || 15);

class streamerService {
  constructor(db) {
    this.streamer = db.Streamer;
    this.guild = db.Guild;
    this.option = db.Option;
    this.guildOptions = db.GuildOptions;
  }

  async create(guildId, streamerName, channelId) {
    const streamer = await this.streamer.findByPk(guildId);

    if (streamer) {
      throw new ConflictError(
        `Streamer ${streamerName} already exists in this guild`
      );
    }

    const newStreamer = await this.streamer.create({
      guildId,
      streamerName,
      channelId,
    });

    return toPlain(newStreamer);
  }

  async getAllLive() {
    const streamers = await this.streamer.findAll({
      where: {
        [Op.or]: [
          // only get streamers where isLive is true or were set to false 15 minutes ago
          { isLive: true },
          {
            isLive: false,
            lastCheckedAt: {
              [Op.lt]: new Date(Date.now() - twitchDelayMinutes * 60 * 1000),
            },
          },
          {
            isLive: false,
            createdAt: {
              [Op.gt]: new Date(Date.now() - twitchDelayMinutes * 60 * 1000),
            },
          },
        ],
      },
      include: [
        {
          model: this.guild,
          include: [
            {
              model: this.option,
              where: { name: "twitchNotification" },
              through: {
                model: this.guildOptions,
                where: { value: 1 },
                attributes: [],
              },
              attributes: [],
              required: true,
            },
          ],
          attributes: [],
          required: true,
        },
      ],
    });

    return toPlain(streamers);
  }

  async getAllGuild(guildId) {
    const streamers = await this.streamer.findAll({
      where: { guildId },
    });

    return toPlain(streamers);
  }

  async update(id, streamerName, channelId) {
    const streamer = await this.streamer.findByPk(id);

    if (!streamer) {
      throw new NotFoundError(`Streamer with id ${id} not found`);
    }

    const updatedStreamer = await streamer.update({ streamerName, channelId });

    return toPlain(updatedStreamer);
  }

  async updateLiveStatus(guildId, streamerName, isLive) {
    const streamer = await this.streamer.findOne({
      where: { guildId, streamerName },
    });

    if (!streamer) {
      return false;
    }

    const updatedStreamer = await streamer.update({
      lastCheckedAt: new Date(),
      isLive,
    });

    return toPlain(updatedStreamer);
  }

  async delete(id) {
    const streamer = await this.streamer.findByPk(id);

    if (!streamer) {
      throw new NotFoundError(`Streamer with id ${id} not found`);
    }

    await streamer.destroy();

    return toPlain(streamer);
  }
}

export default streamerService;
