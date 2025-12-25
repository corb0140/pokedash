const bcrypt = require("bcrypt");
const pool = require("../config/db");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/generateTokens");

// SIGNUP
const signup = async (email, password, username) => {
  const { rows: existingUsers } = await pool.query(
    `SELECT EXISTS (SELECT 1 FROM users WHERE email = $1 OR username = $2)`,
    [email, username]
  );

  if (existingUsers[0].exists)
    throw new ERROR("User already exists with this email or username");

  const hashPassword = await bcrypt.hash(password, 10);

  const { rows } = await pool.query(
    `INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *`,
    [email, hashPassword, username]
  );

  const user = rows[0];

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

// LOGIN
const login = async (identifier, password) => {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE email = $1 OR username = $1`,
    [identifier]
  );

  const user = rows[0];

  if (!user) throw new Error("User not found");

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) throw new Error("Invalid password");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

// DELETE ACCOUNT
const deleteAccount = async (userId) => {
  await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
};

// CHANGE USERNAME
const changeUsername = async (userId, newUsername) => {
  const { rows: existing } = await pool.query(
    `SELECT 1 FROM users WHERE username = $1`,
    [newUsername]
  );

  if (existing.length > 0) {
    throw new Error("Username already taken");
  }

  const { rows } = await pool.query(
    `UPDATE users SET username = $1 WHERE id = $2 RETURNING *`,
    [newUsername, userId]
  );

  return rows[0];
};

// CHANGE PASSWORD
const changePassword = async (userId, currentPassword, newPassword) => {
  const { rows } = await pool.query(
    `SELECT password FROM users WHERE id = $1`,
    [userId]
  );

  const user = rows[0];
  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) throw new Error("Current password is incorrect");

  const hashed = await bcrypt.hash(newPassword, 10);

  await pool.query(`UPDATE users SET password = $1 WHERE id = $2`, [
    hashed,
    userId,
  ]);
};

module.exports = {
  signup,
  login,
  deleteAccount,
  changeUsername,
  changePassword,
};
