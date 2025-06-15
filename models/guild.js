const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Guild extends Model {
    static associate(models) {
      Guild.hasMany(models.Streamer, {
        foreignKey: "guildId",
        onDelete: "cascade",
      });
      Guild.hasMany(models.Option, {
        foreignKey: "guildId",
        onDelete: "cascade",
      });
    }
  }

  Guild.init(
    {
      id: {
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
      indexes: [{ fields: ["id"] }],
    }
  );

  return Guild;
};
