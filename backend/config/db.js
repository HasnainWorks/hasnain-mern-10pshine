const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://hasnain:hasnain32102@notes-cluster.np8ylj4.mongodb.net/notes-app?retryWrites=true&w=majority"
    );

    console.log("MongoDB Atlas Connected");
  } catch (error) {
    console.error("DB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;