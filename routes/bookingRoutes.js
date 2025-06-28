const express = require('express');
const router = express.Router();

const { checkBooking } = require('../controllers/bookingController');

router.post('/check', checkBooking);

module.exports = router;