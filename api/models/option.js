import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Option extends Model {
    static associate(models) {
      Option.belongsToMany(models.guild, {
        through: models.guildOption,
        foreignKey: "optionId",
        otherKey: "guildId",
      });
    }
  }

  Option.init(
    {
      optionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "options",
      timestamps: true,
      indexes: [{ fields: ["guildId"] }],
    }
  );

  return Option;
};
