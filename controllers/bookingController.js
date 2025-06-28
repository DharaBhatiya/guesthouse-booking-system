const Booking = require('../models/bookingModel');
const { createBooking } = require('../models/bookingModel');

const checkBooking = async(req, res) => {
    const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: 'Phone and OTP required' });
  }

  if (otp !== '123456') {
    return res.status(401).json({ success: false, message: 'Invalid OTP' });
  }

  try {
    const bookings = await Booking.getBookingsByPhone(phone);
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
  }
};

const createBookingController = async(req,res) => {
    try{
        const id = await createBooking(req.body);
        res.status(201).json({ success: true, message: "Booking Successfully", bookigId: id });
    }catch(err) {
        res.status(500).json({ success: false, message: "Failed booking", error: err.message}); 
    }
};

module.exports = {
  checkBooking,
  createBookingController
};