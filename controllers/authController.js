const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

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

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = "Auth failed: email or password is incorrect";
    if (!user) {
      return res.status(409).json({ message: errorMsg, success: false });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Sign in Successful",
      success: true,
      jwtToken,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error("Signin Error: ", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

exports.dashboardController = (req,res) =>{
    const {user} = req;
    res.status(200).json({
        message:"Welcome to the Dashboard",
        success: true,
        user : user,
    })
};
