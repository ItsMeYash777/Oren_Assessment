const express = require("express");
const { signup, signin, dashboardController } = require("../controllers/authController");
const {verifyToken} = require("../middlewares/authMiddleware")

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/dashboard", verifyToken, dashboardController);

module.exports = router;
