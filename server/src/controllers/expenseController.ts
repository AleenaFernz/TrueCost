import { Response } from "express";
import db from "../config/db";
import { AuthedRequest } from "../middleware/auth";

// Expense table record type
type ExpenseRow = {
  id: number;
  user_id: number;
  description: string;
  category: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
};

// ✅ 1. Ensure the expenses table exists
export const ensureExpenseTable = () => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      status TEXT CHECK(status IN ('PENDING','APPROVED','REJECTED')) DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `).run();

  console.log("✅ Expenses table verified");
};

// ✅ 2. Create a new expense
export const createExpense = (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { description, category, amount, currency } = req.body;
    if (!description || !category || !amount || !currency) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const stmt = db.prepare(`
      INSERT INTO expenses (user_id, description, category, amount, currency, status)
      VALUES (?, ?, ?, ?, ?, 'PENDING')
    `);
    const result = stmt.run(req.user.id, description, category, amount, currency);

    const created = db
      .prepare("SELECT * FROM expenses WHERE id = ?")
      .get(result.lastInsertRowid as number) as ExpenseRow;

    res.status(201).json({ message: "Expense created successfully", expense: created });
  } catch (err) {
    console.error("❌ createExpense error:", err);
    res.status(500).json({ error: "Failed to create expense" });
  }
};

// ✅ 3. Get all expenses for the logged-in user
export const getMyExpenses = (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const rows = db
      .prepare("SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC")
      .all(req.user.id) as ExpenseRow[];

    res.json({ expenses: rows });
  } catch (err) {
    console.error("❌ getMyExpenses error:", err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

// ✅ 4. Approve an expense (manager/admin only)
export const approveExpense = (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!["manager", "admin"].includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Only manager/admin can approve" });
    }

    const { id } = req.params;
    const result = db.prepare("UPDATE expenses SET status = 'APPROVED' WHERE id = ?").run(Number(id));
    if (result.changes === 0) return res.status(404).json({ error: "Expense not found" });

    const updated = db.prepare("SELECT * FROM expenses WHERE id = ?").get(Number(id));
    res.json({ message: "Expense approved", expense: updated });
  } catch (err) {
    console.error("❌ approveExpense error:", err);
    res.status(500).json({ error: "Failed to approve expense" });
  }
};

// ✅ 5. Reject an expense (manager/admin only)
export const rejectExpense = (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!["manager", "admin"].includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Only manager/admin can reject" });
    }

    const { id } = req.params;
    const result = db.prepare("UPDATE expenses SET status = 'REJECTED' WHERE id = ?").run(Number(id));
    if (result.changes === 0) return res.status(404).json({ error: "Expense not found" });

    const updated = db.prepare("SELECT * FROM expenses WHERE id = ?").get(Number(id));
    res.json({ message: "Expense rejected", expense: updated });
  } catch (err) {
    console.error("❌ rejectExpense error:", err);
    res.status(500).json({ error: "Failed to reject expense" });
  }
};
