import { Router } from "express";
const router = Router();

router.get("/health", (req, res) => {
  const data = {
    uptime: process.uptime(),
    message: "OK",
    date: new Date(),
  };
  return res.status(200).jsend.success(data);
});

export default router;
