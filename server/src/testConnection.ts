import { pool } from './config/db';

(async () => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS time');
    console.log('✅ Connected to MySQL:', rows);
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  } finally {
    process.exit(0);
  }
})();
