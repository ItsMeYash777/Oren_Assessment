// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const mongo_url = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});
app.use("/api", authRoutes);

mongoose
  .connect(mongo_url, { autoIndex: false })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB connection Error", err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
