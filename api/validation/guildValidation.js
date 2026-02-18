import OptionService from "../services/optionService.js";
import db from "../models/index.js";
import { NotFoundError } from "../middleware/error";
import GuildService from "../services/guildService.js";
const optionService = new OptionService(db);
const guildService = new GuildService(db);

// validates guildId for create function
async function validateGuildId(guildId) {
  const errors = [];
  const guildIdRegex = /^\d+$/;

  // check that ID is string consisting of only numbers using regex
  if (
    typeof guildId !== "string" ||
    guildId.trim() === "" ||
    !guildIdRegex.test(guildId.trim())
  ) {
    errors.push("guildId must be a Discord snowflake");
  }

  return errors;
}

// validation for updating GuildOption value
async function validateOptionUpdate(guildId, optionId, value) {
  const errors = [];

  try {
    await guildService.getOne(guildId);
  } catch (error) {
    if (
      error instanceof NotFoundError &&
      error.message === `Guild "${guildId}" not found`
    ) {
      errors.push("guildId doesn't exist");
    }
  }

  try {
    await optionService.getOne(optionId);
  } catch (error) {
    if (
      error instanceof NotFoundError &&
      error.message === `Option "${optionId}" not found`
    ) {
      errors.push("Option doesn't exist");
    }
  }

  if (typeof value !== "boolean" || value.trim() === "") {
    errors.push("Value must be boolean");
  }

  return errors;
}

export { validateGuildId, validateOptionUpdate };
