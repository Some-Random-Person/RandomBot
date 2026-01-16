import { Router } from "express";
const router = Router();
import GuildService from "../services/guildService.js";
import db from "../models/index.js";
const guildService = new GuildService(db);

router.post("/", async (req, res) => {
  const { id, name } = req.body;

  try {
    const guild = await guildService.create(id, name);

    res.status(201).jsend.success({
      status: "success",
      data: {
        statusCode: 201,
        result: "Guild successfully created",
        guild,
      },
    });
  } catch (error) {
    // add proper error handler, next(error)
    console.error(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const guilds = await guildService.getAll();

    res.status(200).jsend.success({
      status: "success",
      data: {
        statusCode: 200,
        result: "Successfully retreived all guilds",
        guilds,
      },
    });
  } catch (error) {
    // add proper error handler, next(error)
    console.error(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const guild = await guildService.getOne(id);

    res.status(200).jsend.success({
      status: "success",
      data: {
        statusCode: 200,
        result: "Successfully retreived guild",
        guild,
      },
    });
  } catch (error) {
    // add proper error handler, next(error)
    console.error(error);
  }
});

router.delete("/", async (req, res) => {
  const { id, name } = req.body;

  try {
    await guildService.delete(id, name);

    res.status(204).end();
  } catch (error) {
    // add proper error handler, next(error)
    console.error(error);
  }
});

export default router;
