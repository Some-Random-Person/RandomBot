import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Reminder extends Model {}

  Reminder.init(
    {
      reminderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      // add reminder name, text, and time
      // look into possibility of repeating
    },
    {
      sequelize,
      tableName: "reminders",
      timestamps: true,
      indexes: [{ fields: ["userId"] }],
    },
  );

  return Reminder;
};
