import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const databaseDir = path.resolve("Database");
const databasePath = path.join(databaseDir, "app.db");

if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
}

const db = new Database(databasePath);
db.pragma("foreign_keys = ON");

export default db;
