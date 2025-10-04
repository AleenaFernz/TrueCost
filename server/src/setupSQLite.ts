import db from "./config/db";

const queries = [
  // 1️⃣ ADMINS TABLE
  `CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    company_name TEXT NOT NULL,
    country TEXT,
    currency TEXT NOT NULL, -- base currency (e.g., USD)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`,

  // 2️⃣ USERS TABLE
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK(role IN ('admin','manager','employee')) DEFAULT 'employee',
    manager_id INTEGER,
    password_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
  );`,

  // 3️⃣ APPROVAL RULES TABLE
  `CREATE TABLE IF NOT EXISTS approval_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    target_user_id INTEGER NOT NULL,
    manager_is_first INTEGER DEFAULT 1,
    approver_sequence TEXT NOT NULL, -- JSON: [manager1_id, manager2_id]
    min_approval_percent INTEGER CHECK(min_approval_percent BETWEEN 0 AND 100),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE
  );`,

  // 4️⃣ EXPENSES TABLE
  `CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    owner_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    expense_date TEXT NOT NULL,
    paid_by TEXT,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    converted_amount REAL,
    conversion_rate REAL,
    receipt_url TEXT,
    status TEXT CHECK(status IN ('draft','waiting','in_review','approved','rejected')) DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
  );`,

  // 5️⃣ EXPENSE APPROVALS TABLE
  `CREATE TABLE IF NOT EXISTS expense_approvals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    expense_id INTEGER NOT NULL,
    approver_id INTEGER NOT NULL,
    step_order INTEGER NOT NULL,
    required INTEGER DEFAULT 1,
    status TEXT CHECK(status IN ('pending','approved','rejected','skipped')) DEFAULT 'pending',
    comment TEXT,
    acted_at DATETIME,
    FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE CASCADE
  );`,

  // 6️⃣ FX RATES CACHE TABLE (for currency conversion)
  `CREATE TABLE IF NOT EXISTS fx_rates_cache (
    base TEXT PRIMARY KEY,
    fetched_at DATETIME NOT NULL,
    blob TEXT NOT NULL
  );`
];

for (const query of queries) {
  db.prepare(query).run();
  console.log("✅ Executed:", query.split("(")[0]);
}

console.log("\n🎉 SQLite database setup complete with all tables!");
