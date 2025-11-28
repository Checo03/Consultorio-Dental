import express from 'express';
import cors from 'cors';
import doctoresRoutes from './routes/doctores.routes.js';
import pacientesRoutes from './routes/pacientes.routes.js';
import citasRoutes from './routes/citas.routes.js';
import historialRoutes from './routes/historial.routes.js';
import tratamientoRoutes from './routes/tratamiento.routes.js';

const app = express();

app.use(cors());          
app.use(express.json());  

app.use('/api', doctoresRoutes);
app.use('/api', pacientesRoutes);
app.use('/api', citasRoutes);
app.use('/api', historialRoutes);
app.use('/api', tratamientoRoutes);

export default app;
