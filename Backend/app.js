import express from 'express';
import pacientesRoutes from './routes/pacientes.routes.js';

const app = express();
app.use(pacientesRoutes);

export default app;