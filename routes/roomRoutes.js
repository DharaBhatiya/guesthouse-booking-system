const express = require("express");
const router = express.Router();
const { getRoomTypes, checkAvailability, getFacilities } = require("../controllers/roomController");

router.get('/types', getRoomTypes);
router.post('/availability', checkAvailability);
router.get('/facilities', getFacilities);

module.exports = router;