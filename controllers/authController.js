const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = async (req, res) => {
  try {
    const { name, phone, email, password, user_type } = req.body;

    if (!name || !phone || !email || !password || !user_type) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findByEmailOrPhone(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email." });
    }

    const password_hash = await bcrypt.hash(password, 10);
    await User.createUser({ name, email, phone, password_hash, user_type });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Register Error:", error.message); // You should see this in terminal
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Both identifier and password required",
        });
    }

    const user = await User.findByEmailOrPhone(identifier);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

const verifyOtp = async (req, res) => {
    const { phone, otp } = req.body;
    if(!phone || !otp) {
        return res.status(400).json({ success: false, message: "Phone and OTP are required" });
    }
    if(otp === "123456") { 
        return res.status(200).json({ success: true, message: "OTP verified successfully" });
    } else {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
};

const logout = async(req,res)=> {
    res.json({ success: true, message: "Logged out successfully" });
}
module.exports = {
  registerUser,
  login,
  verifyOtp,
  logout
};
