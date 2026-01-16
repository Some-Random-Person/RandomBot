import { Router } from "express";
const router = Router();
import OptionService from "../services/optionService.js";
import db from "../models/index.js";
const optionService = new OptionService(db);

router.post("/", async (req, res, next) => {
  const { name } = req.body;

  try {
    const option = await optionService.create(name);

    res.status(201).jsend.success({ option });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const options = await optionService.getAll();

    res.status(200).jsend.success({ options });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const option = await optionService.getOne(id);

    res.status(200).jsend.success({ option });
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  const { id, name } = req.body;

  try {
    const option = await optionService.update(id, name);

    res.status(200).jsend.success({ option });
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  const { id } = req.body;

  try {
    await optionService.delete(id);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
