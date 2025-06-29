const express = require("express");
const router = express.Router();
const {
  getRoomTypesWithPrices,
  checkRoomAvailability,
  checkBookingHistory,
  getRoomFacilities,
} = require("../controllers/PublicController");

//Public Frontend APIs (No Auth Required)
router.get("/rooms/types", getRoomTypesWithPrices);
router.post("/rooms/availability", checkRoomAvailability);
router.post("/bookings/check", checkBookingHistory);
router.get("/rooms/facilities", getRoomFacilities);

module.exports = router;
