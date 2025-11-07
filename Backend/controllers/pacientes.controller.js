import { getConnection, sql } from '../database/connection.js';

export const getPacientes = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('EXEC sp_ObtenerPacientes');
    res.json(result.recordset);
};

export const crearPaciente = async (req, res) => {
    const { Nombre, FechaNacimiento, Genero, Celular, Correo, Direccion, IDDoctor } = req.body;

    if (!Nombre || !FechaNacimiento || !Genero || !Celular || !Correo) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para crear el paciente.' });
    }

    let pool;
    try {
        pool = await getConnection();
        const request = pool.request();
        
        request.input('Nombre', sql.NVarChar(150), Nombre);
        request.input('FechaNacimiento', sql.DateTime, new Date(FechaNacimiento));
        request.input('Genero', sql.TinyInt, Genero); 
        request.input('Celular', sql.NVarChar(50), Celular);
        request.input('Correo', sql.NVarChar(50), Correo);
        request.input('Direccion', sql.NVarChar(500), Direccion);
        request.input('IDDoctor', sql.Int, IDDoctor); 
        
        const result = await request.execute('sp_CrearPaciente');
        
        res.status(201).json(result.recordset);
    } catch (err) {
        console.error('Error al crear paciente:', err);
        res.status(500).json({ 
            message: 'Error en el servidor al crear el paciente.', 
            error: err.message 
        });
    }   
};