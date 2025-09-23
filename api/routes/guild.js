import db from "../models/index.js";
import GuildService from "../services/guildService.js";
const guildService = new GuildService(db);
import { Router } from "express";
const router = Router();

router.post("/", async (req, res, next) => {
  const { id, name } = req.body;

  try {
    const guild = await guildService.create(id, name);

    res.status(201).jsend.success({
      status: "success",
      data: {
        statusCode: 201,
        result: `Successfully added guild "${name}"`,
        guild,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  const { id } = req.body;

  try {
    await guildService.delete(id);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
