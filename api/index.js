import "dotenv/config";
import db from "./models/index.js";
import express from "express";
const app = express();
import jsend from "jsend";

db.sequelize.sync({
  force: false,
  logging: console.log,
});

// middlewares
app.use(jsend.middleware);
app.use(express.json());

// routes
import indexRouter from "./routes/index.js";

// binding routes to app
app.use("/", indexRouter);

// setting port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API is listening on port ${port}`));
