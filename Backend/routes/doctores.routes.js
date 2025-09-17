import { Router } from 'express';
import { loginDoctor, getDoctores } from '../controllers/doctores.controller.js';

const router = Router();

router.get('/doctores', getDoctores);
router.post('/login', loginDoctor);

export default router;