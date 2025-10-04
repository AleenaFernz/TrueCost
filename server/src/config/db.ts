// // import mysql from "mysql2/promise";
// // import dotenv from "dotenv";

// // dotenv.config();

// // export const pool = mysql.createPool({
// //   host: process.env.MYSQLHOST,
// //   user: process.env.MYSQLUSER,
// //   password: process.env.MYSQLPASSWORD,
// //   database: process.env.MYSQLDATABASE,
// //   port: Number(process.env.MYSQLPORT),
// //   waitForConnections: true,
// //   connectionLimit: 10,
// //   queueLimit: 0,
// // });

// import mysql from "mysql2/promise";
// import dotenv from "dotenv";
// dotenv.config({ path: ".env.local" });

// export const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   connectionLimit: 10,
// });

import Database from "better-sqlite3";

// Creates (or opens) a local file named "truecost.db" in your server folder
const db = new Database("truecost.db");

// Enable foreign keys
db.pragma("foreign_keys = ON");

export default db;

