import { Router } from 'express';
import { loginDoctor } from '../controllers/doctores.controller.js';

const router = Router();

router.post('/login', loginDoctor);

export default router;