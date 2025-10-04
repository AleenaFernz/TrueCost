import { Router } from 'express';
import { registerAdmin } from './auth.controller';

const router = Router();

// This creates the POST /register-admin endpoint
router.post('/register-admin', registerAdmin);

export default router;
