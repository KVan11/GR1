import { Router } from 'express';
import { register, login, getUsers } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);    // URL: http://localhost:3000/api/auth/register
router.post('/login', login);
router.get('/users', getUsers);

export default router;