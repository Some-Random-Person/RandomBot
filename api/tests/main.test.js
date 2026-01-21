import express from "express";
import jsend from "jsend";
import createError from "http-errors";
import indexRouter from "../routes/index.js";
import request from "supertest";

describe("Index Routes", () => {
  let app;

  beforeEach(() => {
    // Create fresh app instance for each test
    app = express();
    app.use(jsend.middleware);
    app.use(express.json());
    app.use("/", indexRouter);

    // Add 404 handler and error handler (mock if needed)
    app.use((req, res, next) => {
      next(createError(404));
    });
    // Mock errorHandler if it has external dependencies
    app.use((error, req, res) => {
      res.status(error.status || 500).send({
        status: "fail",
        message: error.message || "Internal Server Error",
      });
    });
  });

  describe("Tests for the GET endpoint /health", () => {
    test("Should return status 200 for GET /health", async () => {
      const healthResponse = await request(app).get("/health");

      expect(healthResponse.statusCode).toBe(200);
    });

    test("Should return health status 'healthy' for GET /health", async () => {
      const healthResponse = await request(app).get("/health");

      const health = healthResponse.body.data;

      expect(health.status).toBe("healthy");
    });
  });
});
