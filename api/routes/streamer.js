import { Router } from "express";
const router = Router();
import StreamerService from "../services/streamerService.js";
import db from "../models/index.js";
const streamerService = new StreamerService(db);

router.post("/", async (req, res, next) => {
  const { guildId, streamerName, channelId } = req.body;

  try {
    const streamer = await streamerService.create(
      guildId,
      streamerName,
      channelId
    );

    return res.status(201).jsend.success(streamer);
  } catch (error) {
    next(error);
  }
});

// getAllLive
router.get("/live", async (req, res, next) => {
  try {
    const streamers = await streamerService.getAllLive();

    return res.status(200).jsend.success(streamers);
  } catch (error) {
    next(error);
  }
});

// getAllGuild
router.get("/guild", async (req, res, next) => {
  const { guildId } = req.body;
  try {
    const streamers = await streamerService.getAllGuild(guildId);

    return res.status(200).jsend.success(streamers);
  } catch (error) {
    next(error);
  }
});

// update
router.put("/", async (req, res, next) => {
  const { id, streamerName, channelId } = req.body;

  try {
    const streamer = await streamerService.update(id, streamerName, channelId);

    return res.status(200).jsend.success(streamer);
  } catch (error) {
    next(error);
  }
});

// updateLiveStatus
router.put("/status", async (req, res, next) => {
  const { guildId, streamerName, isLive } = req.body;

  try {
    const streamer = await streamerService.updateLiveStatus(
      guildId,
      streamerName,
      isLive
    );

    return res.status(200).jsend.success(streamer);
  } catch (error) {
    next(error);
  }
});

// delete
router.delete("/", async (req, res, next) => {
  const { id } = req.body;

  try {
    await streamerService.delete(id);

    return res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
