import "dotenv/config";
import app from "./app";
import db from "./config/db";

const PORT = Number(process.env.PORT) || 8080;

(() => {
  try {
    const time = db.prepare("SELECT datetime('now') AS time").get();
    console.log("✅ Connected to SQLite:", time);
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
