const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const Metrics = require("../models/Metrics")


//signup controller
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ message: "User already exists", success: false });
    }
    const userModel = new UserModel({
      name,
      email,
      password: await bcrypt.hash(password,10),
    });

    await userModel.save();

    res.status(201).json({ message: "Sign up Successful", success: true });
  } catch (error) {
    console.error("Signup Error: ", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};


//signin controller with HTTP-ONLY cookies format
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = "Auth failed: email or password is incorrect";
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: errorMsg, success: false });
    }
   
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("jwt", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Signin Error: ", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};



// To check if the refreshTokens are expired or not, for reauthentication
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });
  try {
    const userData = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const newToken = jwt.sign(
      { email: userData.email, _id: userData._id },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );
    res.cookie("jwt", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Token refreshed" });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};


exports.logout = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, secure: true, expires: new Date(0) });
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out" });
};

//Metrics controllers
exports.getMetrics = async (req, res) => {
  try {
    const metrics = await Metrics.findOne();
    res.json(
      metrics || {
        carbonEmissions: Array(5).fill(0),
        waterUsage: Array(5).fill(0),
        wasteGenerated: Array(5).fill(0),
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
};
exports.saveMetrics = async (req, res) => {
  try {
    const { carbonEmissions, waterUsage, wasteGenerated } = req.body;
    const existingMetrics = await Metrics.findOne();

    if (existingMetrics) {
      existingMetrics.carbonEmissions = carbonEmissions;
      existingMetrics.waterUsage = waterUsage;
      existingMetrics.wasteGenerated = wasteGenerated;
      await existingMetrics.save();
      return res.json(existingMetrics);
    }
    const newMetrics = new Metrics({
      carbonEmissions,
      waterUsage,
      wasteGenerated,
    });
    await newMetrics.save();
    res.json(newMetrics);
  } catch (error) {
    res.status(500).json({ error: "Failed to save metrics" });
  }
};

