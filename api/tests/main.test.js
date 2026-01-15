import request from "supertest";
import express from "express";
import jsend from "jsend";
import createError from "http-errors";
import indexRouter from "../routes/index.js";

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

  describe("/health", () => {
    test("GET Health data", async () => {
      const healthResponse = await request(app).get("/health");

      const health = healthResponse.body.data;

      expect(healthResponse.statusCode).toBe(200);
      expect(health.message).toBe("OK");
    });
  });
});
