const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");

router.use(verifyToken);

router.get("/dashboard", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Admin Dashboard",
    user: req.user,
  });
});

module.exports = router;
