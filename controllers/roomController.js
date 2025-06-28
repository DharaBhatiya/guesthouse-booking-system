const Room = require('../models/roomModel');
const { getFacilities } = require('../models/roomModel');

const getRoomTypes = async (req,res) =>{
  try {
    const roomTypes = await Room.getRoomTypes();
    res.json({ success: true, data: roomTypes });
  } catch (error) {
    // console.error("Error fetching room types:", error);
    res.status(500).json({ success: false, message: 'Failed to get room types', error: error.message });
  }
};

const checkAvailability = async (req, res) => {
    const { start_date, end_date, room_type } = req.body;
    if(!start_date || !end_date || !room_type) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    try {
        const availabled = await Room.checkAvailability(start_date, end_date, room_type);
        res.json({ success: true, availabled });
    } catch (error) {
        // console.error("Error checking room availability:", error);
        res.status(500).json({ success: false, message: 'Availability check failed', error: error.message });
    }
};

const getFacilitiesController = async (req, res) => {
  console.log("✅ Controller reached: GET /api/rooms/facilities");

  try {
    const facilities = await getFacilities();
    console.log("✅ Facilities fetched:", facilities);

    res.json({ success: true, facilities });
  } catch (err) {
    console.error("❌ Error in controller:", err);
    res.status(500).json({
      success: false,
      message: 'Failed to get facilities',
      error: err.message
    });
  }
};
// const getFacilitiesController = (req, res) => {
//   console.log("Test controller working");
//   res.json({ success: true, facilities: ["WiFi", "TV", "AC"] });
// };


module.exports = {
    getRoomTypes,
    checkAvailability,
    getFacilities
}