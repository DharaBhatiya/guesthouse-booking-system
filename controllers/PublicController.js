const db = require("../config/db");

//- GET /api/rooms/types: Get room types (Deluxe/Suite) with pricing.
const getRoomTypesWithPrices = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT room_type, 
             MIN(date_from) as start, 
             MAX(date_to) as end,
             MIN(price_member) as min_member_price,
             MIN(price_non_member) as min_non_member_price
      FROM room_prices
      GROUP BY room_type
    `);

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching room types:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//- POST /api/rooms/availability: Check room availability by date range.
const checkRoomAvailability = async (req, res) => {
  const { from_date, to_date } = req.body;

  const sql = `
    SELECT r.id, r.room_number, r.room_type, r.status
    FROM rooms r
    WHERE r.status = 'available'
      AND r.id NOT IN (
        SELECT room_id FROM bookings
        WHERE (from_date <= ? AND to_date >= ?)
           OR (from_date <= ? AND to_date >= ?)
           OR (from_date >= ? AND to_date <= ?)
      )
  `;

  try {
    await db.query(
      sql,
      [to_date, to_date, from_date, from_date, from_date, to_date],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

//- POST /api/bookings/check: User checks past bookings via phone and OTP.
const checkBookingHistory = async (req, res) => {
  const { phone } = req.body;

  const sql = `
    SELECT b.id, b.from_date, b.to_date, r.room_number, r.room_type
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN rooms r ON b.room_id = r.id
    WHERE u.phone = ?
    ORDER BY b.created_at DESC
  `;

  try {
    const [results] = await db.query(sql, [phone]);
    res.status(200).json(results);
  } catch (err) {
    console.error("Booking history error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//- GET /api/rooms/facilities: List available room facilities.
const getRoomFacilities = async (req, res) => {
  try {
    const [results] = await db.query(`SELECT facilities FROM rooms`);

    const allFacilities = new Set();

    results.forEach((row) => {
      if (row.facilities) {
        row.facilities
          .split(",")
          .map((f) => f.trim())
          .forEach((f) => allFacilities.add(f));
      }
    });

    res.status(200).json([...allFacilities]);
  } catch (err) {
    console.error("Error fetching facilities:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getRoomTypesWithPrices,
  checkRoomAvailability,
  checkBookingHistory,
  getRoomFacilities
};
