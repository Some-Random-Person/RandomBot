import { toPlain } from "../utility/toPlain";

class StreamerService {
  constructor(db) {
    this.streamer = db.Streamer;
    this.guild = db.Guild;
    this.option = db.Option;
  }

  async add(guildId, streamerName, channelId) {
    try {
      const streamer = await this.streamer.findOne({
        where: { guildId, streamerName },
      });

      if (streamer) {
        const updatedStreamer = streamer.update({ streamerName, channelId });

        return updatedStreamer;
      }

      const newStreamer = await this.streamer.create({
        guildId,
        streamerName,
        channelId,
      });

      return newStreamer;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllLive() {
    try {
      const streamers = await this.streamer.findAll({
        include: [
          {
            model: this.guild,
            include: [
              {
                model: this.option,
                where: { setting: "twitchNotification", value: 1 },
                required: true,
              },
            ],
            required: true,
          },
        ],
      });

      return toPlain(streamers);
    } catch (error) {
      console.error(error);
    }
  }

  async getAllGuild(guildId) {
    try {
      const streamers = await this.streamer.findAll({
        where: { guildId },
      });

      return streamers;
    } catch (error) {
      console.error(error);
    }
  }

  async update(guildId, streamerName, channelId) {
    try {
      const streamer = await this.streamer.findOne({
        where: { guildId, streamerName },
      });

      if (!streamer) {
        const newStreamer = await this.streamer.create({
          guildId,
          streamerName,
          channelId,
        });

        return newStreamer;
      }

      const updatedStreamer = streamer.update({ streamerName, channelId });

      return updatedStreamer;
    } catch (error) {
      console.error(error);
    }
  }

  async updateLiveStatus(guildId, streamerName, isLive) {
    try {
      const streamer = await this.streamer.findOne({
        where: { guildId, streamerName },
      });

      if (!streamer) {
        return false;
      }

      const updatedStreamer = streamer.update({ isLive });

      return updatedStreamer;
    } catch (error) {
      console.error(error);
    }
  }

  async delete(guildId, streamerName) {
    try {
      const streamer = await this.streamer.findOne({
        where: { guildId, streamerName },
      });

      if (!streamer) {
        console.error("Streamer not found");
      }

      await streamer.destroy();
    } catch (error) {
      console.error(error);
    }
  }
}

export default StreamerService;
