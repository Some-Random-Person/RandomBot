import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Guild extends Model {
    static associate(models) {
      Guild.hasMany(models.Streamer, {
        foreignKey: "guildId",
        onDelete: "cascade",
      });
      Guild.belongsToMany(models.Option, {
        through: models.GuildOption,
        foreignKey: "guildId",
        otherKey: "optionId",
      });
      Guild.hasOne(models.Welcome, {
        foreignKey: "guildId",
        onDelete: "cascade",
      });
    }
  }

  Guild.init(
    {
      guildId: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        validate: {
          is: {
            args: /^\d+$/,
            msg: "guildId must be a string of digits (Discord snowflake ID)",
          },
        },
      },
    },
    {
      sequelize,
      tableName: "guilds",
      timestamps: true,
      indexes: [{ fields: ["guildId"] }],
    }
  );

  return Guild;
};
