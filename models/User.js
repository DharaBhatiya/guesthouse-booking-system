const db = require('../config/db');

const findUserByEmailOrPhone = async (identifier) => {
    const [rows] = await db.query(
        'SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1',
        [identifier, identifier]
    );
    return rows[0];
};

module.exports = {
    findUserByEmailOrPhone
};