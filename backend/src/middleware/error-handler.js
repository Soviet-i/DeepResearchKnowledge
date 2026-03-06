const HttpError = require("../utils/http-error");

function notFoundHandler(req, res) {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(err, req, res, next) {
  const status = err instanceof HttpError ? err.status : 500;
  const response = {
    message: err.message || "Internal server error",
  };

  if (err instanceof HttpError && err.details) {
    response.details = err.details;
  }

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json(response);
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
