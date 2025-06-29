const db = require("../config/db");

const verifyPayment = async (req, res) => {
  const { booking_id, payment_id, status } = req.body;

  try {
    if (status !== "success") {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const [result] = await db.query(
      `UPDATE bookings SET payment_status = 'paid' WHERE id = ?`,
      [booking_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ message: "Payment verified", payment_id });
  } catch (err) {
    res.status(500).json({ message: "Verification error", error: err.message });
  }
};

module.exports = {
  verifyPayment,
};
