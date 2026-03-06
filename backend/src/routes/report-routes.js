const express = require("express");
const { tryAuth } = require("../middleware/auth");
const { buildReport } = require("../services/report-service");
const { addHistory } = require("../services/history-service");
const HttpError = require("../utils/http-error");

const router = express.Router();

router.post("/generate", tryAuth, async (req, res, next) => {
  try {
    const { query, papers, reportType } = req.body || {};

    if (!query || typeof query !== "string") {
      throw new HttpError(400, "Query is required");
    }

    const allowed = new Set(["summary", "detailed", "comparative"]);
    const safeReportType = allowed.has(reportType) ? reportType : "summary";

    const reportContent = buildReport({
      query: query.trim(),
      papers: Array.isArray(papers) ? papers : [],
      reportType: safeReportType,
    });

    if (req.auth?.userId) {
      await addHistory(req.auth.userId, {
        type: "report",
        query: query.trim(),
        metadata: {
          reportType: safeReportType,
          paperCount: Array.isArray(papers) ? papers.length : 0,
        },
      });
    }

    res.json({ reportContent });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
