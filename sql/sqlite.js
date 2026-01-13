const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./main.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS main_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user TEXT NOT NULL,
      unique_id TEXT UNIQUE,
      activated BOOLEAN DEFAULT FALSE,
      created_at INTEGER
    )
  `);
});

module.exports = db;
