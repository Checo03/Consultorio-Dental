import { Router } from 'express';
import { crearPaciente, getPacientes } from '../controllers/pacientes.controller.js';

const router = Router();

router.get('/pacientes', getPacientes);
router.post('/crearPacientes', crearPaciente);


export default router;