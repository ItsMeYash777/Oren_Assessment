const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const Metrics = require("../models/Metrics");

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
      password: await bcrypt.hash(password, 10),
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
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("jwt", jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 15 * 60 * 1000,
      domain: ".onrender.com",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "None",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: ".onrender.com",
    });
    console.log("Cookies set:", { jwt: jwtToken, refreshToken });
    return res.status(200).json({
      message: "Login successful",
      user: {
        email: user.email,
        id: user._id,
      },
    });
  } catch (error) {
    console.error("Signin Error: ", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken)
    return res
      .status(401)
      .json({ message: "Unauthorized", isAuthenticated: false });
  try {
    const userData = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const newToken = jwt.sign(
      { email: userData.email, _id: userData._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("jwt", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path :"/",
      maxAge: 15 * 60 * 1000,
      domain: ".onrender.com",
    });
    res.status(200).json({ message: "Token refreshed" });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
    domain: ".onrender.com",
    path: "/",
    sameSite: "None",
  });
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
    domain: ".onrender.com",
    path: "/",
    sameSite: "None",
  });
  res.status(200).json({ message: "Logged out", isAuthenticated: false });
};

exports.checkSession = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ isAuthenticated: false });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({ isAuthenticated: false });
    }
    res.json({
      isAuthenticated: true,
      user: {
        email: user.email,
        id: user._id,
      },
    });
  } catch (error) {
    res.status(401).json({ isAuthenticated: false });
  }
};

exports.saveMetrics = async (req, res) => {
  try {
    const { carbonEmissions, waterUsage, wasteGenerated } = req.body;
    const existingMetrics = await Metrics.findOne({
      carbonEmissions: { $eq: carbonEmissions },
      waterUsage: { $eq: waterUsage },
      wasteGenerated: { $eq: wasteGenerated },
    });

    if (existingMetrics) {
      return res.status(400).json({
        success: false,
        message: "These metrics already exist in the database!",
      });
    }

    // If metrics don't exist, save them
    const newMetrics = new Metrics({
      carbonEmissions,
      waterUsage,
      wasteGenerated,
    });

    await newMetrics.save();
    res.json({
      success: true,
      message: "Metrics saved successfully",
      data: newMetrics,
    });
  } catch (error) {
    console.error("Save Metrics Error:", error);
    res
      .status(500)
      .json({ error: "Failed to save metrics", details: error.message });
  }
};
