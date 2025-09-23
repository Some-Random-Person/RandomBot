import "dotenv/config";
import db from "./models/index.js";
import express from "express";
const app = express();
import jsend from "jsend";
import http from "http";
import { errorHandler } from "./middleware/error.js";
import createError from "http-errors";

db.sequelize.sync({
  force: false,
  logging: console.log,
});

// middlewares
app.use(jsend.middleware);
app.use(express.json());

// routes
import indexRouter from "./routes/index.js";
import guildRouter from "./routes/guild.js";

// binding routes to app
app.use("/", indexRouter);
app.use("/guild", guildRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

// setting port
const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${port} is already in use. Please specify a different port.`
    );
    process.exit(1);
  }

  if (error.code === "EACCES") {
    console.error(`Port ${port} requires elevated privileges.`);
    process.exit(1);
  }

  console.error("Server error:", error);
  process.exit(1);
});

server.on("listening", () => {
  console.log(`API is listening on port ${port}`);
});

server.listen(port);
