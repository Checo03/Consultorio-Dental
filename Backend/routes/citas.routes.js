import { Router } from 'express';
import { getCitas, getCitasCompletas, crearCita } from '../controllers/citas.controller.js';

const router = Router();

router.get('/citas', getCitas);
router.get('/citasCompletas', getCitasCompletas);
router.post('/citasCrear', crearCita);



export default router;