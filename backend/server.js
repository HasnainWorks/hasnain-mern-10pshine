require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");
const pinoHttp = require("pino-http");
const logger = require("./utils/logger");

const app = express();

// DB connection
connectDB();


// Middlewares
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

// Routes
app.use("/api", noteRoutes);
app.use("/api/auth", authRoutes);

// Health check route
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

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});