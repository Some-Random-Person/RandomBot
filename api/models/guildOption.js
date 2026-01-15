import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class GuildOption extends Model {
    static associate(models) {
      GuildOption.belongsTo(models.Guild, {
        foreignKey: "guildId",
        as: "guild",
      });
      GuildOption.belongsTo(models.Option, {
        foreignKey: "optionId",
        as: "option",
      });
    }
  }

  GuildOption.init(
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
      optionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      value: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "guildOptions",
    }
  );

  return GuildOption;
};
