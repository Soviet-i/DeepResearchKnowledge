const express = require("express");
const HttpError = require("../utils/http-error");
const userService = require("../services/user-service");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name } = req.body || {};
    const result = await userService.register({ email, password, name });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const result = await userService.login({ email, password });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.auth.userId);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", requireAuth, async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.auth.userId);
    const token = userService.signToken(user);
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
});

router.use((req, res, next) => next(new HttpError(404, "Auth endpoint not found")));

module.exports = router;
