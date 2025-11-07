import { getConnection, sql } from '../database/connection.js';

export const getCitas = async (req, res) => {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
        return res.status(400).json({ 
            message: 'Faltan parámetros obligatorios de fecha: start_date y end_date.' 
        });
    }

    let pool;
    try {
        pool = await getConnection();
        const request = pool.request();
        
        const fechaInicio = new Date(start_date);
        const fechaFin = new Date(end_date);
        
        request.input('FechaInicio', sql.Date, fechaInicio);
        request.input('FechaFin', sql.Date, fechaFin);
        
        const result = await request.execute('sp_ObtenerCitas');
        res.status(201).json(result.recordset);
        
    } catch (err) {
        console.error('Error al obtener citas:', err);
        res.status(500).json({ 
            message: 'Error en el servidor al obtener citas.', 
            error: err.message 
        });
    } 
};

export const getCitasCompletas = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const request = pool.request();
        const result = await request.execute('sp_ObtenerTodasLasCitas');
        res.status(201).json(result.recordset);
        
    } catch (err) {
        console.error('Error al obtener todas las citas:', err);
        res.status(500).json({ 
            message: 'Error en el servidor al obtener la lista completa de citas.', 
            error: err.message 
        });
    } 
};

export const crearCita = async (req, res) => {
    const { 
        IDPaciente, 
        Fecha, 
        Hora, 
        Motivo, 
        Notas, 
        Prioridad 
    } = req.body;

    if (!IDPaciente || !Fecha || !Hora || !Motivo || Prioridad === undefined) {
        return res.status(400).json({ 
            message: 'Faltan campos obligatorios para programar la cita.' 
        });
    }

    let pool;
    try {
        pool = await getConnection();
        const request = pool.request();

        const horaSQL = `${Hora}:00`;

        request.input('IDPaciente', sql.Int, IDPaciente);
        request.input('FechaCita', sql.Date, Fecha); 
        request.input('HoraCita', sql.NVarChar(20), horaSQL);              
        request.input('Motivo', sql.NVarChar(150), Motivo);    
        request.input('Notas', sql.NVarChar(500), Notas); 
        request.input('Prioridad', sql.TinyInt, Prioridad);

        const result = await request.execute('sp_CrearCita');
        
        res.status(201).json({
            message: 'Cita programada exitosamente.',
        });
        
    } catch (err) {
        console.error('Error al programar la cita:', err);
        res.status(500).json({ 
            message: 'Error en el servidor al programar la cita.', 
            error: err.message 
        });
    } 
};