import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from './config/db'; // Corrected path

// This is the function that handles the registration logic
export const registerAdmin = async (req: Request, res: Response) => {
  const { name, email, password, company_name, country, currency } = req.body;

  // Basic validation
  if (!name || !email || !password || !company_name || !currency) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const db = await pool.getConnection();

    // Check if user already exists
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if ((existingUsers as any[]).length > 0) {
        db.release();
        return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Use a transaction to ensure both inserts succeed or fail together
    await db.beginTransaction();

    // 1. Insert into admins table
    const [adminResult] = await db.query(
      'INSERT INTO admins (name, email, password_hash, company_name, country, currency) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, password_hash, company_name, country, currency]
    );
    const adminId = (adminResult as any).insertId;

    // 2. Insert into users table
    const [userResult] = await db.query(
      'INSERT INTO users (admin_id, name, email, role, password_hash) VALUES (?, ?, ?, ?, ?)',
      [adminId, name, email, 'admin', password_hash]
    );
    const userId = (userResult as any).insertId;

    await db.commit();
    db.release();

    res.status(201).json({
      message: 'Admin and company registered successfully',
      adminId: adminId,
      userId: userId,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    await (await pool.getConnection()).rollback(); // Rollback on error
    res.status(500).json({ message: 'Server error during registration' });
  }
};
