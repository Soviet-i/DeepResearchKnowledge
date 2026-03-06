const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const config = require("../config");
const HttpError = require("../utils/http-error");
const { isValidEmail } = require("../utils/validators");
const { readStorage, writeStorage } = require("./storage");

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    preferences: user.preferences || {
      theme: "auto",
      language: "zh-CN",
      notifications: true,
    },
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

async function register({ email, password, name }) {
  if (!isValidEmail(email)) {
    throw new HttpError(400, "Invalid email format");
  }

  if (typeof password !== "string" || password.length < 6) {
    throw new HttpError(400, "Password must be at least 6 characters");
  }

  const db = await readStorage();
  const normalizedEmail = email.trim().toLowerCase();
  const exists = db.users.find((u) => u.email === normalizedEmail);
  if (exists) {
    throw new HttpError(409, "Email already registered");
  }

  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    id: uuidv4(),
    email: normalizedEmail,
    name: name?.trim() || normalizedEmail.split("@")[0],
    role: "user",
    passwordHash,
    preferences: {
      theme: "auto",
      language: "zh-CN",
      notifications: true,
    },
    createdAt: now,
    updatedAt: now,
  };

  db.users.push(user);
  await writeStorage(db);

  return {
    token: signToken(user),
    user: sanitizeUser(user),
  };
}

async function login({ email, password }) {
  if (!isValidEmail(email) || typeof password !== "string") {
    throw new HttpError(400, "Invalid credentials");
  }

  const db = await readStorage();
  const normalizedEmail = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email === normalizedEmail);

  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const matched = await bcrypt.compare(password, user.passwordHash);
  if (!matched) {
    throw new HttpError(401, "Invalid email or password");
  }

  return {
    token: signToken(user),
    user: sanitizeUser(user),
  };
}

async function getUserById(userId) {
  const db = await readStorage();
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  return user;
}

async function getProfile(userId) {
  const user = await getUserById(userId);
  return sanitizeUser(user);
}

async function updateProfile(userId, { name, email }) {
  const db = await readStorage();
  const user = db.users.find((u) => u.id === userId);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  if (email !== undefined) {
    if (!isValidEmail(email)) {
      throw new HttpError(400, "Invalid email format");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const conflict = db.users.find((u) => u.email === normalizedEmail && u.id !== userId);
    if (conflict) {
      throw new HttpError(409, "Email already in use");
    }
    user.email = normalizedEmail;
  }

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      throw new HttpError(400, "Name cannot be empty");
    }
    user.name = name.trim();
  }

  user.updatedAt = new Date().toISOString();
  await writeStorage(db);

  return sanitizeUser(user);
}

async function updatePassword(userId, { currentPassword, newPassword }) {
  if (typeof newPassword !== "string" || newPassword.length < 6) {
    throw new HttpError(400, "New password must be at least 6 characters");
  }

  const db = await readStorage();
  const user = db.users.find((u) => u.id === userId);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const matched = await bcrypt.compare(currentPassword || "", user.passwordHash);
  if (!matched) {
    throw new HttpError(401, "Current password is incorrect");
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.updatedAt = new Date().toISOString();
  await writeStorage(db);
}

async function updatePreferences(userId, preferences = {}) {
  const db = await readStorage();
  const user = db.users.find((u) => u.id === userId);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const merged = {
    theme: preferences.theme || user.preferences?.theme || "auto",
    language: preferences.language || user.preferences?.language || "zh-CN",
    notifications:
      typeof preferences.notifications === "boolean"
        ? preferences.notifications
        : (user.preferences?.notifications ?? true),
  };

  user.preferences = merged;
  user.updatedAt = new Date().toISOString();
  await writeStorage(db);

  return merged;
}

async function deleteAccount(userId) {
  const db = await readStorage();
  const beforeCount = db.users.length;
  db.users = db.users.filter((u) => u.id !== userId);
  db.history = db.history.filter((h) => h.userId !== userId);

  if (db.users.length === beforeCount) {
    throw new HttpError(404, "User not found");
  }

  await writeStorage(db);
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  updatePassword,
  updatePreferences,
  deleteAccount,
  signToken,
};
