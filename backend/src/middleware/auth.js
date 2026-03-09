const jwt = require("jsonwebtoken");
const config = require("../config");
const HttpError = require("../utils/http-error");

function parseBearer(header) {
  if (!header || typeof header !== "string") return null;
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

function requireAuth(req, res, next) {
  try {
    const token = parseBearer(req.headers.authorization);
    if (!token) {
      throw new HttpError(401, "Missing authentication token");
    }

    const payload = jwt.verify(token, config.jwtSecret);
    req.auth = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    if (error instanceof HttpError) return next(error);
    return next(new HttpError(401, "Invalid or expired token"));
  }
}

function tryAuth(req, res, next) {
  const token = parseBearer(req.headers.authorization);
  if (!token) return next();

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.auth = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    // Ignore invalid token for optional auth routes.
  }

  return next();
}

module.exports = {
  requireAuth,
  tryAuth,
};
