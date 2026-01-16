import { Router } from "express";
const router = Router();

router.get("/health", (req, res) => {
  return res.status(200).jsend.success({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
