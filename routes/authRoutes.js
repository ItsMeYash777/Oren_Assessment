const express = require("express");
const { signup, signin, refreshToken, logout, checkAuth, getMetrics, saveMetrics } = require("../controllers/authController");
const {verifyToken} = require("../middlewares/authMiddleware")

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/refresh-token", refreshToken)
router.get("/dashboard", verifyToken,(req,res)=>{
    res
      .status(200)
      .json({ message: "Access Granted for Dashboard", isAuthenticated: true });
});
router.get("/logout",logout);

// Routes for metrics data

router.get("/metrics", getMetrics);
router.post("/metrics",saveMetrics)


module.exports = router;
