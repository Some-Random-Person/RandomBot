import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Welcome extends Model {
    static associate(models) {
      Welcome.belongsTo(models.Guild, {
        foreignKey: "guildId",
      });
    }
  }

  Welcome.init(
    {
      guildId: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
      },
      welcomeTitle: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      welcomeMessage: {
        type: DataTypes.STRING(512),
        allowNull: false,
      },
      welcomeChannel: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      welcomeImageUrl: {
        type: DataTypes.STRING(100),
      },
      welcomeColor: {
        type: DataTypes.STRING(6),
      },
    },
    {
      sequelize,
      tableName: "welcomes",
      timestamps: true,
      indexes: [{ fields: ["guildId"] }],
    }
  );

  return Welcome;
};
