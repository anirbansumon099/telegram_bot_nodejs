// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    userId INTEGER PRIMARY KEY,
    username TEXT,
    name TEXT,
    password TEXT,
    status TEXT,
    token TEXT
  )`);
});

module.exports = db;
