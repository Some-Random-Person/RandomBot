import express from "express";
import jsend from "jsend";
import indexRouter from "../routes/index.js";
import request from "supertest";
import { errorHandler } from "../middleware/error.js";

describe("Index Routes", () => {
  let app;

  beforeEach(() => {
    // Create fresh app instance for each test
    app = express();
    app.use(jsend.middleware);
    app.use(express.json());
    app.use("/", indexRouter);

    app.use(errorHandler);
  });

  describe("Health endpoint", () => {
    it("returns status 200 with healthy data for GET", async () => {
      const healthResponse = await request(app).get("/health");

      expect(healthResponse.statusCode).toBe(200);
      expect(healthResponse.body.data.status).toBe("healthy");
    });
  });
});
