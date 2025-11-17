import { Router } from 'express';
import { getCitas, getCitasCompletas, crearCita, updateCitaEstado } from '../controllers/citas.controller.js';

const router = Router();

router.get('/citas', getCitas);
router.get('/citasCompletas', getCitasCompletas);
router.post('/citasCrear', crearCita);
router.post('/citasEstado', updateCitaEstado);


export default router;