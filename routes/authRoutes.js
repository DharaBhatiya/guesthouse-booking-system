const express = require("express");
const router = express.Router();
const { login, registerUser, verifyOtp, logout  } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

const db = require("../config/db");

router.get("/test-db", (req, res) => {
  db.query("SELECT 1 + 1 AS result", (err, rows) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ result: rows[0].result });
  });
});

router.post("/register", registerUser);
router.post("/login", login);

router.post("/verify-otp", verifyOtp);

router.post("/logout", logout);

router.get("/profile", verifyToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
