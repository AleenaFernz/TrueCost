import 'dotenv/config';
import app from './app';

const PORT = Number(process.env.PORT) || 8080; // use Railway's PORT if set

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
