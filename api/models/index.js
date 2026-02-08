import "dotenv/config";
import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import { getConfig } from "./config/database";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const config = getConfig();
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
  },
);
const db = {};

db.sequelize = sequelize;

const files = fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  );
});

for (const file of files) {
  // builds file path with 'file://' prefix for import()
  const pathToFile = path.join(__dirname, file);
  const modulePath = `file://${pathToFile}`;

  const modelModule = await import(modulePath);
  const model = modelModule.default(sequelize, DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
