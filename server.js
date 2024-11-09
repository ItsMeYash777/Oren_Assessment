// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const mongo_url = process.env.MONGO_URI;
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());y
const corsOptions = {
  origin: "https://oren-assessment-6pgtmtmu1-itsmeyash777s-projects.vercel.app", // Allow only the frontend to make requests
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));


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
