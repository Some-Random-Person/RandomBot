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
async function validateOptionUpdate(value) {
  const errors = [];

  if (typeof value !== "boolean" || value.trim() === "") {
    errors.push("Value must be boolean");
  }

  return errors;
}

export { validateGuildId, validateOptionUpdate };
