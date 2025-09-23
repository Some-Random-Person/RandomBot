import db from "../models/index.js";
import ErrorService from "../services/errorService.js";
const errorService = new ErrorService(db);
import { Router } from "express";
const router = Router();

router.post("/", async (req, res, next) => {
  const { id, name } = req.body;

  try {
    

    res.status(201).jsend.success({
      status: "success",
      data: {
        statusCode: 201,
        result: ``,
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
    await errorService.delete(id);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
