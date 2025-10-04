import express from "express";
import { requireAuth } from "../middleware/auth";
import { ensureExpenseTable, createExpense, getMyExpenses, approveExpense, rejectExpense } from "../controllers/expenseController";

const router = express.Router();

ensureExpenseTable();

router.post("/", requireAuth, createExpense);
router.get("/", requireAuth, getMyExpenses);
router.put("/:id/approve", requireAuth, approveExpense);
router.put("/:id/reject", requireAuth, rejectExpense);

export default router;
