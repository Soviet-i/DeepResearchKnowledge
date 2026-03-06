const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const config = require("./config");
const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes");
const paperRoutes = require("./routes/paper-routes");
const reportRoutes = require("./routes/report-routes");
const { notFoundHandler, errorHandler } = require("./middleware/error-handler");

const app = express();

app.use(
  cors({
    origin: config.corsOrigin === "*" ? true : config.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/papers", paperRoutes);
app.use("/api/reports", reportRoutes);

// Compatibility mounts without /api prefix.
app.use("/auth", authRoutes);
app.use("/", userRoutes);
app.use("/papers", paperRoutes);
app.use("/reports", reportRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
