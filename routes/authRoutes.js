const express = require("express");
const { signup, signin, refreshToken, logout, saveMetrics,checkSession } = require("../controllers/authController");
const {verifyToken} = require("../middlewares/authMiddleware")

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/refresh-token", refreshToken)
router.get("/dashboard", verifyToken,(req,res)=>{
    res
      .status(200)
      .json({ message: "Access Granted for Dashboard", isAuthenticated: true, token: req.user.token });
});
router.get("/logout",logout);
router.get("/check-session",checkSession);

router.post("/metrics",saveMetrics)


module.exports = router;
