const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB Atlas Connected");
  } catch (error) {
    logger.error({ err: error }, "DB Connection Error");
    process.exit(1);
  }
};

module.exports = connectDB;