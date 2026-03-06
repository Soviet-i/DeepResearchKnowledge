const { v4: uuidv4 } = require("uuid");
const { readStorage, writeStorage } = require("./storage");

async function addHistory(userId, payload) {
  if (!userId) return;

  const db = await readStorage();
  db.history.push({
    id: uuidv4(),
    userId,
    ...payload,
    createdAt: new Date().toISOString(),
  });

  // Keep latest 200 history entries per user.
  const userItems = db.history.filter((h) => h.userId === userId);
  if (userItems.length > 200) {
    const removeCount = userItems.length - 200;
    const removableIds = userItems
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(0, removeCount)
      .map((item) => item.id);

    db.history = db.history.filter((h) => !removableIds.includes(h.id));
  }

  await writeStorage(db);
}

async function getHistory(userId) {
  const db = await readStorage();
  return db.history
    .filter((item) => item.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function deleteHistoryItem(userId, historyId) {
  const db = await readStorage();
  const before = db.history.length;
  db.history = db.history.filter((item) => !(item.userId === userId && item.id === historyId));
  await writeStorage(db);
  return db.history.length !== before;
}

async function clearHistory(userId) {
  const db = await readStorage();
  db.history = db.history.filter((item) => item.userId !== userId);
  await writeStorage(db);
}

module.exports = {
  addHistory,
  getHistory,
  deleteHistoryItem,
  clearHistory,
};
