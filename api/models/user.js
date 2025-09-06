import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Reminder, {
        foreignKey: "userId",
        onDelete: "cascade",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        validate: {
          is: {
            args: /^\d+$/,
            msg: "userId must be a string of digits (Discord snowflake ID)",
          },
        },
      },
    },
    {
      sequelize,
      tableName: "users",
      timestamps: true,
      indexes: [{ fields: ["id"] }],
    }
  );

  return User;
};
