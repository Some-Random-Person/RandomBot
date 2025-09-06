function toPlain(obj) {
  if (Array.isArray(obj)) {
    return obj.map(toPlain);
  }
  if (obj && typeof obj === "object") {
    // If it's a Sequelize instance, use .get({ plain: true })
    if (typeof obj.get === "function") {
      return toPlain(obj.get({ plain: true }));
    }
    // Otherwise, recursively process object properties
    const result = {};
    for (const key of Object.keys(obj)) {
      result[key] = toPlain(obj[key]);
    }
    return result;
  }
  return obj;
}

module.exports = { toPlain };
