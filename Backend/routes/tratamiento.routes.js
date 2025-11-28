import { Router } from 'express';
import { getTratamiento, actualizarTratamientoPost, crearTratamiento } from '../controllers/tratamiento.controller.js';

const router = Router();

router.get('/tratamiento', getTratamiento);
router.post('/actualizarTratamientoPost', actualizarTratamientoPost);
router.post('/crearTratamiento', crearTratamiento);


export default router;