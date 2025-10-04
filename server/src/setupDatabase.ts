import { pool } from './config/db';
import { Pool } from 'mysql2/promise';

const queries = [
  `CREATE TABLE IF NOT EXISTS admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    country VARCHAR(255),
    currency VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('admin', 'manager', 'employee') DEFAULT 'employee',
    manager_id INT,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
  );`,

  `CREATE TABLE IF NOT EXISTS approval_rules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    target_user_id INT NOT NULL,
    manager_is_first BOOLEAN DEFAULT TRUE,
    approver_sequence JSON NOT NULL,
    min_approval_percent INT CHECK(min_approval_percent BETWEEN 0 AND 100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    owner_id INT NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    expense_date DATE NOT NULL,
    paid_by VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    converted_amount DECIMAL(10, 2),
    conversion_rate DECIMAL(10, 6),
    receipt_url VARCHAR(255),
    status ENUM('draft', 'waiting', 'in_review', 'approved', 'rejected') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS expense_approvals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    expense_id INT NOT NULL,
    approver_id INT NOT NULL,
    step_order INT NOT NULL,
    required BOOLEAN DEFAULT TRUE,
    status ENUM('pending', 'approved', 'rejected', 'skipped') DEFAULT 'pending',
    comment TEXT,
    acted_at TIMESTAMP NULL,
    FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS fx_rates_cache (
    base VARCHAR(10) PRIMARY KEY,
    fetched_at TIMESTAMP NOT NULL,
    rates_json JSON NOT NULL
  );`
];

async function setupDatabase(dbPool: Pool) {
  try {
    for (const query of queries) {
      await dbPool.query(query);
      console.log(`✅ Table created successfully: ${query.substring(0, 40)}...`);
    }
    console.log("\n🎉 MySQL database setup complete with all tables!");
  } catch (err) {
    console.error("❌ Error setting up database:", err);
  } finally {
    process.exit(0);
  }
}

setupDatabase(pool);