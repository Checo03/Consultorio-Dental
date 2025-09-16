import express from 'express';
import cors from 'cors';
import doctoresRoutes from './routes/doctores.routes.js';

const app = express();

app.use(cors());          
app.use(express.json());  

app.use('/api', doctoresRoutes);

export default app;
