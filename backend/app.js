require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const pinoHttp = require("pino-http");
const logger = require("./utils/logger");
const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// Rate Limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many attempts, please try again later" },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" },
});

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(pinoHttp({ logger }));

// Apply limiters
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

// Routes
app.use("/api", noteRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", aiRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;