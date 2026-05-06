require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const logger = require("./utils/logger");

// Validate required environment variables before starting
if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not defined in .env");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("FATAL: MONGO_URI is not defined in .env");
  process.exit(1);
}

if (!process.env.GROQ_API_KEY) {
  console.error("FATAL: GROQ_API_KEY is not defined in .env");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
});