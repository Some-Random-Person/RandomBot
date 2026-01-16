import { Router } from "express";
const router = Router();
import GuildService from "../services/guildService.js";
import db from "../models/index.js";
const guildService = new GuildService(db);

router.post("/", async (req, res, next) => {
  const { id } = req.body;

  try {
    const guild = await guildService.create(id);

    res.status(201).jsend.success(guild);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const guilds = await guildService.getAll();

    res.status(200).jsend.success(guilds);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const guild = await guildService.getOne(id);

    res.status(200).jsend.success(guild);
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
