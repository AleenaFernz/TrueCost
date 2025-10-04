import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from './config/db'; // Corrected path

// This is the function that handles the registration logic
export const registerAdmin = async (req: Request, res: Response) => {
  const { name, email, password, company_name, country, currency } = req.body;

  // Basic validation
  if (!name || !email || !password || !company_name || !currency) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const db = await pool.getConnection();
  try {
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

    res.status(201).json({
      message: 'Admin and company registered successfully',
      adminId: adminId,
      userId: userId,
    });
  } catch (error) {
    await db.rollback(); // Rollback on error
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  } finally {
    db.release();
  }
};

// NEW: Login Function
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const db = await pool.getConnection();
  try {
    // Find the user by email
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = (users as any)[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // User is authenticated, create a JWT
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      adminId: user.admin_id
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'super_secret_key', {
      expiresIn: '1h', // Token expires in 1 hour
    });

    res.status(200).json({
      message: 'Login successful',
      token: token,
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  } finally {
    db.release();
  }
};

