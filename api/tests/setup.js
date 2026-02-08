import db from "../models/index.js";

beforeAll(async () => {
  await db.sequelize.sync({ force: true, logging: false });
});

afterAll(async () => {
  await db.sequelize.drop();
  await db.sequelize.close();
});
