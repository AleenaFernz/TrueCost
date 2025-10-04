import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db";

interface DbUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const SALT_ROUNDS = 10;

// ✅ SIGNUP
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, password are required" });
    }

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, created_at)
      VALUES (?, ?, ?, COALESCE(?, 'employee'), datetime('now'))
    `);
    const result = stmt.run(name, email, password_hash, role ?? null);

    const user = db
      .prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?")
      .get(result.lastInsertRowid as number) as DbUser;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({ message: "Signup successful", user, token });
  } catch (err) {
    console.error("❌ Signup error:", err);
    return res.status(500).json({ error: "Signup failed" });
  }
};

// ✅ LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as DbUser | undefined;

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
};
