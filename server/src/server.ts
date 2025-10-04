import 'dotenv/config';
import app from './app';
import { pool } from './config/db';

const PORT = Number(process.env.PORT) || 8080; // use Railway's PORT if set

(async () => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS time');
    console.log('✅ Connected to MySQL:', rows);
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
})();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
