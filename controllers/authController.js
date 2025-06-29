const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST-http://localhost:3000/api/auth/register
const register = async (req, res) => {
  const { name, email, phone, password, user_type } = req.body;
  try {
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    console.log("Checking for existing users with email:");
    if (existingUsers.length > 0) {
      console.warn("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");
    await db.query(
      "INSERT INTO users (name, phone, email, password_hash, user_type) VALUES (?, ?, ?, ?, ?)",
      [name, phone, email, hashpassword, user_type || "customer"]
    );
    console.log("User registered:", email);
    return res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// POST http://localhost:3000/api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        user_type: user.user_type,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

//- POST /api/auth/verify-otp: Verify OTP for user to access booking history.
const verifyOtp = async (req, res) => {
  const { phone } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE phone = ?", [
      phone,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = jwt.sign(
      { id: users[0].id, role: users[0].user_type },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({ message: "OTP verified", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  register,
  login,
  verifyOtp,
};
