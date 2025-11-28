import { Router } from 'express';
import { getHistorial, crearHistorial, actualizarHistorial } from '../controllers/historial.controller.js';

const router = Router();

router.get('/historial', getHistorial);
router.post('/crearHistorial', crearHistorial);
router.post('/actualizarHistorial', actualizarHistorial);


export default router;