// used when something goes wrong with the database
class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseError";
    this.statusCode = 500;
  }
}

// used when resource is not found, e.g. when creating home if the specified participant doesn't exist
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

// used when there is a conflict, e.g. when you try to create something that already exists
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}

// used when user is unauthorized, e.g. invalid login data, or user not logged in
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

// Used when the submitted info fails validation
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

// used when trying to delete an item with foreign keys stopping it's deletion
class ForeignKeyConstraintError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForeignKeyConstraint";
    this.statusCode = 409;
  }
}

// handles the error and sends the proper info to the end user
function errorHandler(error, req, res, next) {
  console.error(error);

  const knownErrors = [
    DatabaseError,
    NotFoundError,
    ConflictError,
    UnauthorizedError,
    ForbiddenError,
    ValidationError,
    ForeignKeyConstraintError,
  ];

  // Check if the error is one of the known ones, and handles them properly
  if (knownErrors.some((ErrorClass) => error instanceof ErrorClass)) {
    return res.status(error.statusCode).jsend.fail({
      error: error.name,
      message: error.message,
    });
  }

  // handles the 404 errors from app.js
  if (error.status === 404) {
    return res.status(404).jsend.fail({
      error: "NotFound",
      message: error.message || "Resource not found",
    });
  }

  // sends generic error message if it doesn't match above
  return res.status(500).jsend.error({
    message: "An unexpected error occurred.",
  });
}

export {
  DatabaseError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
  ForeignKeyConstraintError,
  errorHandler,
};
