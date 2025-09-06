import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Reminder extends Model {}

  Reminder.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      setting: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "reminders",
      timestamps: true,
      indexes: [{ fields: ["userId"] }],
    }
  );

  return Reminder;
};
