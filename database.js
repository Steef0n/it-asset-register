const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dataDirectory = path.join(__dirname, "data");
const databasePath = path.join(dataDirectory, "assets.db");

if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
}

const db = new sqlite3.Database(databasePath, (error) => {
    if (error) {
        console.error("Database connection failed:", error.message);
        return;
    }

    console.log("Connected to SQLite database.");
});

db.run(`
    CREATE TABLE IF NOT EXISTS assets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assetNumber TEXT NOT NULL,
        user TEXT NOT NULL,
        department TEXT NOT NULL,
        deviceType TEXT NOT NULL,
        serialNumber TEXT NOT NULL,
        warrantyExpiry TEXT NOT NULL,
        location TEXT NOT NULL
    )
`);

module.exports = db;