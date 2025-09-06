import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Streamer extends Model {
    static associate(models) {
      Streamer.belongsTo(models.Guild, {
        foreignKey: "guildId",
      });
    }
  }

  Streamer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      guildId: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      streamerName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      isLive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      channelId: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "streamers",
      timestamps: true,
      indexes: [{ fields: ["guildId"] }],
    }
  );

  return Streamer;
};
