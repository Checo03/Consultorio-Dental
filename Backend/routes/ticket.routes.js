import { Router } from 'express';
import { getTicket, actualizarTicket, crearTicket } from '../controllers/ticket.controller.js';

const router = Router();

router.get('/ticket', getTicket);
router.post('/actualizarTicket', actualizarTicket);
router.post('/crearTicket', crearTicket);


export default router;