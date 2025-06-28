const db = require("../config/db");

const createUser = async ({ name, email, phone, password_hash, user_type }) => {
  const created_at = new Date();
  const sql = `
    INSERT INTO users (name, email, phone, password_hash, created_at, user_type)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, [
    name,
    email,
    phone,
    password_hash,
    created_at,
    user_type,
  ]);
  return result;
};

const findByEmailOrPhone = async (identifier) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1",
    [identifier, identifier]
  );
  return rows[0];
};

module.exports = {
  createUser,
  findByEmailOrPhone,
};
