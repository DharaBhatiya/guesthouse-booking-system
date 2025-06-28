const db = require('../config/db');

const getRoomTypes = async() => {
    const [rows] = await db.query('SELECT DISTINCT room_type AS type FROM rooms');
    return rows;
}

const checkAvailability = async (room_type, start_date, end_date) => {
  const [rows] = await db.query(
    'SELECT * FROM rooms WHERE room_type = ? AND status = "available"',
    [room_type]
  );
  return rows.length > 0;
};


const getFacilities = async () => {
  const [rows] = await db.query('SELECT facilities FROM rooms');
  if (!rows || rows.length === 0) return [];

  const allFacilities = rows.flatMap(row => {
    const f = row.facilities || '';
    return f.split(',').map(x => x.trim()).filter(Boolean);
  });

  const uniqueFacilities = [...new Set(allFacilities)];
  return uniqueFacilities;
};


module.exports = {
  getRoomTypes,
  checkAvailability,
  getFacilities
};
