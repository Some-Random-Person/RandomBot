import express from "express";
import jsend from "jsend";
import guildRouter from "../routes/guild.js";
import request from "supertest";
import db from "../models/index.js";
import { errorHandler } from "../middleware/error.js";

describe("Guild endpoint", () => {
  let app;

  beforeEach(async () => {
    // Create fresh app instance for each test
    app = express();
    app.use(jsend.middleware);
    app.use(express.json());
    app.use("/guild", guildRouter);

    await db.sequelize.sync({ force: true });

    app.use(errorHandler);
  });

  describe("Create guild", () => {
    it("returns status 201 with created guildId for POST with valid data", async () => {
      const guildResponse = await request(app).post("/guild").send({
        id: "580466660377362493",
      });

      expect(guildResponse.statusCode).toBe(201);
      expect(guildResponse.body.data.guildId).toBe("580466660377362493");
    });

    it("returns status 409 with message for POST with already existing guild", async () => {
      await request(app).post("/guild").send({
        id: "580466660377362493",
      });
      const guildResponse = await request(app).post("/guild").send({
        id: "580466660377362493",
      });

      expect(guildResponse.statusCode).toBe(409);
      expect(guildResponse.body.data.message).toBe(
        'Guild "580466660377362493" already exists',
      );
    });

    it("returns status 400 with message for POST with invalid data", async () => {
      const guildResponse = await request(app)
        .post("/guild")
        .send({ id: "test" });

      expect(guildResponse.statusCode).toBe(400);
      expect(guildResponse.body.data.message).toBeDefined();
    });
  });

  describe("Get guild", () => {
    it("returns status 200 with guild info for GET With valid data", async () => {
      await request(app).post("/guild").send({
        id: "580466660377362493",
      });
      const guildResponse = await request(app).get("/guild/580466660377362493");

      expect(guildResponse.statusCode).toBe(200);
      expect(guildResponse.body.data.guildId).toBe("580466660377362493");
    });

    it("return 404 with message for GET with non-existent guild", async () => {
      const guildResponse = await request(app).get("/guild/580466660377362493");

      expect(guildResponse.statusCode).toBe(404);
      expect(guildResponse.body.data.message).toBe(
        'Guild "580466660377362493" not found',
      );
    });

    it("return 400 with message for GET with invalid data", async () => {
      await request(app).post("/guild").send({
        id: "580466660377362493",
      });
      const guildResponse = await request(app).get("/guild/");

      expect(guildResponse.statusCode).toBe(400);
      expect(guildResponse.body.data.message).toBeDefined();
    });
  });

  describe("Get all guilds", () => {
    it("return 200 with guild info for GET with valid data", async () => {
      await request(app).post("/guild").send({
        id: "580466660377362493",
      });
      await request(app).post("/guild").send({
        id: "690590760814379079",
      });

      const guildResponse = await request(app).get("/guild");

      expect(guildResponse.statusCode).toBe(200);
      expect(guildResponse.body.data).toEqual(
        expect.arrayOf(
          expect.objectContaining({
            guildId: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ),
      );
    });

    it("return 404 with message for GET with no existing guilds", async () => {
      const guildResponse = await request(app).get("/guild");

      expect(guildResponse.statusCode).toBe(404);
      expect(guildResponse.body.data.message).toBe("No guilds found");
    });
  });

  describe("Deletes guild", () => {
    it("return 204 for DELETE with valid data", async () => {
      await request(app).post("/guild").send({
        id: "580466660377362493",
      });

      const guildResponse = await request(app).delete(
        "/guild/580466660377362493",
      );

      expect(guildResponse.statusCode).toBe(204);
    });

    it("return 404 with message for DELETE with non-existent guild", async () => {
      const guildResponse = await request(app).delete(
        "/guild/580466660377362493",
      );

      expect(guildResponse.statusCode).toBe(404);
      expect(guildResponse.body.data.message).toBe(
        'Guild "580466660377362493" not found',
      );
    });
  });
});
