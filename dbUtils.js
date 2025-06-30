// dbUtils.js
const db = require('./db');

function getUserById(userId) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE userId = ?", [userId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function registerUser(userId, username, name, password) {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO users (userId, username, name, password, status, token) VALUES (?, ?, ?, ?, 'active', '')",
      [userId, username, name, password], (err) => {
        if (err) reject(err);
        else resolve(true);
      });
  });
}

function updateUser(userId, field, value) {
  return new Promise((resolve, reject) => {
    db.run(`UPDATE users SET ${field} = ? WHERE userId = ?`, [value, userId], (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
}

function deleteUser(userId) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM users WHERE userId = ?", [userId], (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
}

function setStatus(userId, status) {
  return updateUser(userId, "status", status);
}

function getUserStatus(userId) {
  return new Promise((resolve, reject) => {
    db.get("SELECT status FROM users WHERE userId = ?", [userId], (err, row) => {
      if (err) reject(err);
      else resolve(row ? row.status : null);
    });
  });
}

module.exports = {
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
  setStatus,
  getUserStatus
};
