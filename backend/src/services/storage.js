const fs = require("fs/promises");
const path = require("path");
const config = require("../config");

const defaultData = {
  users: [],
  history: [],
};

async function ensureStorageFile() {
  const dir = path.dirname(config.storagePath);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(config.storagePath);
  } catch {
    await fs.writeFile(config.storagePath, JSON.stringify(defaultData, null, 2), "utf8");
  }
}

async function readStorage() {
  await ensureStorageFile();
  const raw = await fs.readFile(config.storagePath, "utf8");

  try {
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return { ...defaultData };
  }
}

async function writeStorage(data) {
  await ensureStorageFile();
  await fs.writeFile(config.storagePath, JSON.stringify(data, null, 2), "utf8");
}

module.exports = {
  readStorage,
  writeStorage,
};
