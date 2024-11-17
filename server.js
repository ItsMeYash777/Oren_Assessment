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

app.use(express.json());
const corsOptions = {
  origin: [
    "https://oren.vercel.app",
    "http://localhost:5173",
    "https://oren-gnms4vm90-itsmeyash777s-projects.vercel.app",
  ], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  credentials: true,
  allowedHeaders: [
    "Content-Type", 
    "Authorization"
  ],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin); // Dynamic origin
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Origin, X-Requested-With, Accept'
  );
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({
      body: "OK"
    });
  }
  
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

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
