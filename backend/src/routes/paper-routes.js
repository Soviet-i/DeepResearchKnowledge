const express = require("express");
const { searchPapers } = require("../services/paper-service");
const { addHistory } = require("../services/history-service");
const { toInt } = require("../utils/validators");
const { tryAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/search", tryAuth, async (req, res, next) => {
  try {
    const yearsParam = req.query.year;
    const yearsRaw = Array.isArray(yearsParam) ? yearsParam : yearsParam ? [yearsParam] : [];
    const years = yearsRaw
      .map((y) => Number.parseInt(y, 10))
      .filter((v) => Number.isFinite(v));

    const result = await searchPapers({
      query: String(req.query.query || "").trim(),
      type: req.query.type ? String(req.query.type) : "",
      years,
      author: req.query.author ? String(req.query.author) : "",
      source: req.query.source ? String(req.query.source) : "",
      sortBy: req.query.sortBy ? String(req.query.sortBy) : "relevance",
      page: Math.max(1, toInt(req.query.page, 1)),
      pageSize: Math.min(50, Math.max(1, toInt(req.query.pageSize, 10))),
    });

    if (req.auth?.userId) {
      await addHistory(req.auth.userId, {
        type: "search",
        query: String(req.query.query || ""),
        metadata: {
          total: result.total,
          filters: {
            type: req.query.type || null,
            years,
            author: req.query.author || null,
            source: req.query.source || null,
          },
        },
      });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
