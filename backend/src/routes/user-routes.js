const express = require("express");
const { requireAuth } = require("../middleware/auth");
const userService = require("../services/user-service");
const historyService = require("../services/history-service");

const router = express.Router();

router.get("/users/me", requireAuth, async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.auth.userId);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.put("/users/me", requireAuth, async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.auth.userId, req.body || {});
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.put("/users/me/password", requireAuth, async (req, res, next) => {
  try {
    await userService.updatePassword(req.auth.userId, req.body || {});
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
});

router.delete("/users/me", requireAuth, async (req, res, next) => {
  try {
    await userService.deleteAccount(req.auth.userId);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    next(error);
  }
});

router.get("/users/me/preferences", requireAuth, async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.auth.userId);
    res.json({ preferences: user.preferences || {} });
  } catch (error) {
    next(error);
  }
});

router.put("/users/me/preferences", requireAuth, async (req, res, next) => {
  try {
    const preferences = await userService.updatePreferences(req.auth.userId, req.body || {});
    res.json({ preferences });
  } catch (error) {
    next(error);
  }
});

router.get("/users/me/history", requireAuth, async (req, res, next) => {
  try {
    const items = await historyService.getHistory(req.auth.userId);
    res.json({ items, total: items.length });
  } catch (error) {
    next(error);
  }
});

router.delete("/users/me/history/:id", requireAuth, async (req, res, next) => {
  try {
    const deleted = await historyService.deleteHistoryItem(req.auth.userId, req.params.id);
    res.json({ deleted });
  } catch (error) {
    next(error);
  }
});

router.delete("/users/me/history", requireAuth, async (req, res, next) => {
  try {
    await historyService.clearHistory(req.auth.userId);
    res.json({ message: "History cleared" });
  } catch (error) {
    next(error);
  }
});

// Compatibility routes for alternate frontend calls.
router.get("/user/history", requireAuth, async (req, res, next) => {
  try {
    const items = await historyService.getHistory(req.auth.userId);
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.delete("/user/history/:id", requireAuth, async (req, res, next) => {
  try {
    const deleted = await historyService.deleteHistoryItem(req.auth.userId, req.params.id);
    res.json({ deleted });
  } catch (error) {
    next(error);
  }
});

router.delete("/user/history", requireAuth, async (req, res, next) => {
  try {
    await historyService.clearHistory(req.auth.userId);
    res.json({ message: "History cleared" });
  } catch (error) {
    next(error);
  }
});

router.put("/user/preferences", requireAuth, async (req, res, next) => {
  try {
    const preferences = await userService.updatePreferences(req.auth.userId, req.body || {});
    res.json(preferences);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
