import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Option extends Model {
    static associate(models) {
      Option.belongsTo(models.Guild, {
        foreignKey: "guildId",
      });
    }
  }

  Option.init(
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
      setting: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING(100),
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
