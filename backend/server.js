const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const noteRoutes = require("./routes/noteRoutes");


const app = express();

connectDB(); 

app.use(cors());
app.use(express.json());
app.use("/api", noteRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});