const db = require("../config/db");
const path = require("path");

//POST /api/admin/rooms/create: Add new room.
const createRoom = async (req, res) => {
  try {
    const { room_type, room_number, status, facilities } = req.body;

    if (!room_type || !room_number || !status || !facilities) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await db.query(
      "INSERT INTO rooms (room_type, room_number, status, facilities) VALUES (?, ?, ?, ?)",
      [room_type, room_number, status, facilities]
    );

    res.status(201).json({
      message: "Room Created",
      room_id: result.insertId,
    });
  } catch (err) {
    console.error("Room Creation Error:", err);
    res
      .status(500)
      .json({ message: "Something went wrong!", error: err.message });
  }
};

//- PUT /api/admin/rooms/update/:id: Update room details.
const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { room_type, room_number, status, facilities } = req.body;

  try {
    if (!room_type || !room_number || !status || !facilities) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await db.query(
      `UPDATE rooms SET room_type = ?, room_number = ?, status = ?, facilities = ? WHERE id = ?`,
      [room_type, room_number, status, facilities, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room Updated" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: `Room number '${room_number}' already exists.` });
    }

    console.error("Room Update Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//- DELETE /api/admin/rooms/delete/:id: Delete a room.
const deleteRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(`DELETE FROM rooms WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room Deleted" });
  } catch (err) {
    console.error("Delete Room Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//- POST /api/admin/rooms/set-price: Set room pricing based on date and member status.
const setRoomPrice = async (req, res) => {
  const { room_type, date_from, date_to, price_member, price_non_member } =
    req.body;

  try {
    const sql = `
      INSERT INTO room_prices 
      (room_type, date_from, date_to, price_member, price_non_member) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      room_type,
      date_from,
      date_to,
      price_member,
      price_non_member,
    ]);

    res.status(201).json({ message: "Room Price Set", id: result.insertId });
  } catch (err) {
    console.error("Error setting room price:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//- POST /api/admin/rooms/upload-image: Upload photos for room.

//- POST /api/admin/bookings/create-walkin: Book for walk-in customer.
const createWalkinBooking = async (req, res) => {
  const {
    user_id,
    room_id,
    from_date,
    to_date,
    is_member,
    membership_number,
    id_proof_url,
    payment_status,
    payment_mode,
  } = req.body;

  try {
    const sql = `
      INSERT INTO bookings 
      (user_id, room_id, from_date, to_date, is_member, membership_number, id_proof_url, payment_status, payment_mode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      user_id,
      room_id,
      from_date,
      to_date,
      is_member,
      membership_number,
      id_proof_url,
      payment_status,
      payment_mode,
    ]);

    res.status(201).json({
      message: "Walk-in booking created",
      booking_id: result.insertId,
    });
  } catch (err) {
    console.error("Error creating walk-in booking:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//- GET /api/admin/customers/history: View booking history.
const customerHistory = async (req, res) => {
  const phone = req.query.phone;

  try {
    const sql = `
      SELECT b.*, r.room_number, r.room_type
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN rooms r ON b.room_id = r.id
      WHERE u.phone = ?
      ORDER BY b.created_at DESC
    `;

    const [results] = await db.query(sql, [phone]);

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching customer history:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//- POST /api/admin/users/create-staff: Create staff user.
const createStaff = async (req, res) => {
  const { name, email, password_hash, role } = req.body;

  try {
    const sql = `
      INSERT INTO staff_users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [name, email, password_hash, role]);

    res.status(201).json({
      message: "Staff created",
      staff_id: result.insertId,
    });
  } catch (err) {
    console.error("Create Staff Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//- GET /api/admin/users/list: List all staff users.
const listStaff = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT id, name, email, role FROM staff_users ORDER BY created_at DESC`
    );

    res.status(200).json({ staff: results });
  } catch (err) {
    console.error("List Staff Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = {
  createRoom,
  updateRoom,
  deleteRoom,
  setRoomPrice,
  createWalkinBooking,
  customerHistory,
  createStaff,
  listStaff,
};
