import express from 'express';
import cors from 'cors';
import authRoutes from './auth.routes'; // 1. IMPORT YOUR ROUTES

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get('/', (req, res) => res.send('Backend running successfully 🚀'));

// API Routes
app.use('/api/auth', authRoutes); // 2. USE YOUR ROUTES

export default app;
