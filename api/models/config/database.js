export const getConfig = () => {
  const env = process.env.NODE_ENV || "development";

  if (env === "test") {
    return {
      database: process.env.TEST_DB_NAME,
      username: process.env.DB_ADMIN_USERNAME,
      password: process.env.DB_ADMIN_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: process.env.DB_DIALECT,
    };
  }

  return {
    database: process.env.DB_NAME,
    username: process.env.DB_ADMIN_USERNAME,
    password: process.env.DB_ADMIN_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  };
};
 