const db = require('../config/db');

const getBookingsByPhone = async (phone) => {
  const [rows] = await db.query(
    `SELECT b.id, b.check_in, b.check_out, r.type AS room_type
     FROM bookings b
     JOIN rooms r ON b.room_id = r.id
     WHERE b.phone = ?`,
    [phone]
  );
  return rows;
};

const createBooking = async (data) => {
  const sql = `INSERT INTO bookings(user_name, phone, email, room_type, check_in, check_out, id_proof, membership_type) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
  const [result] = await db.query(sql, [
    data.user_name,
    data.phone,
    data.email,
    data.room_type,
    data.check_in,
    data.check_out,
    data.id_proof,
    data.membership_type  
  ]);
  return result.insertId;
};

module.exports = {
  getBookingsByPhone,
  createBooking
};
