const db = require("../config/db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// - POST /api/bookings/create: Create booking with user details, membership info, and ID proof.
const createBooking = async (req, res) => {
  const {
    user_id,
    room_id,
    from_date,
    to_date,
    is_member,
    membership_number,
    id_proof_url,
    payment_mode,
  } = req.body;

  const bookingsql = `
    INSERT INTO bookings(
      user_id, room_id, from_date, to_date, 
      is_member, membership_number, id_proof_url, 
      payment_status, payment_mode
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    user_id,
    room_id,
    from_date,
    to_date,
    is_member,
    membership_number || null,
    id_proof_url || "",
    "pending",
    payment_mode,
  ];

  try {
    const [result] = await db.query(bookingsql, values);
    res
      .status(201)
      .json({ message: "Booking created", booking_id: result.insertId });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Booking error", error: err.message });
  }
};

// - GET /api/bookings/history: Get user’s booking history (requires OTP token).
const getHistory = async (req, res) => {
  const { phone } = req.query;

  try {
    const [results] = await db.query(
      `
      SELECT b.*, r.room_number, r.room_type
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN rooms r ON b.room_id = r.id
      WHERE u.phone = ?
      ORDER BY b.created_at DESC
    `,
      [phone]
    );

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createBooking,
  getHistory,
};
