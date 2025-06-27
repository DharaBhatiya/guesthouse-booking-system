const db = require('../config/db');

const findUserByEmailOrPhone = async (identifier) => {
    const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ? OR phone = ?',
        [identifier, identifier]
    );
    return rows[0];
};

module.exports = {
    findUserByEmailOrPhone
};