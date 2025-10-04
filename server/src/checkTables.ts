import db from "./config/db";

const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all();
console.log("🧩 Tables in database:", tables);
