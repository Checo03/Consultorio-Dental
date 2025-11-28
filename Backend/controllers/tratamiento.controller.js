import { getConnection, sql } from '../database/connection.js';

export const getTratamiento = async (req, res) => {
    const { IDPaciente, IDCita } = req.query; 

    if (!IDPaciente) {
        return res.status(400).json({ 
            message: 'Falta el parámetro obligatorio: IDPaciente.' 
        });
    }

    const pacienteID = parseInt(IDPaciente);

    let pool;
    try {
        pool = await getConnection();
        const request = pool.request();
        
        request.input('IDPaciente', sql.Int, pacienteID);
        request.input('IDCita', sql.Int, parseInt(IDCita));
        
        const result = await request.execute('sp_ObtenerTratamiento');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ 
                message: `Tratamiento no encontrado para el paciente ID: ${pacienteID}.` 
            });
        }

        res.status(200).json(result.recordset[0]);
        
    } catch (err) {
        console.error('Error al obtener tratamiento:', err);
        res.status(500).json({ 
            message: 'Error en el servidor al obtener el tratamiento.', 
            error: err.message 
        });
    } 
};

export const crearTratamiento = async (req, res) => {
    const { IDPaciente, IDCita ,Descripcion } = req.body; 

    if (!IDPaciente || !Descripcion) {
        return res.status(400).json({ 
            message: 'Faltan campos obligatorios: IDPaciente y Descripcion.' 
        });
    }

    let pool;
    try {
        pool = await getConnection();
        const request = pool.request();
        
        request.input('IDPaciente', sql.Int, parseInt(IDPaciente));
        request.input('IDCita', sql.Int, parseInt(IDCita));
        request.input('Descripcion', sql.NVarChar, Descripcion);
        
        const result = await request.execute('sp_CrearTratamiento');
        
        res.status(201).json({ 
            message: 'Tratamiento creado con éxito.',
            ID: result.recordset?.[0]?.ID || 'N/A'
        });
        
    } catch (err) {
        console.error('Error al crear tratamiento:', err);
        res.status(500).json({ 
            message: 'Error en el servidor al crear el tratamiento.', 
            error: err.message 
        });
    } 
};

export const actualizarTratamientoPost = async (req, res) => {
    const { IDTratamiento, IDPaciente, Descripcion } = req.body; 

    if (!IDTratamiento || !IDPaciente || !Descripcion) {
        return res.status(400).json({ 
            message: 'Faltan campos obligatorios para actualizar: IDTratamiento, IDPaciente y Descripcion.' 
        });
    }

    let pool;
    try {
        pool = await getConnection();
        const request = pool.request();
        
        request.input('IDTratamiento', sql.Int, parseInt(IDTratamiento)); 
        request.input('IDPaciente', sql.Int, parseInt(IDPaciente));
        request.input('Descripcion', sql.NVarChar, Descripcion);
        
        const result = await request.execute('sp_ActualizarTratamiento');
        
        if (result.rowsAffected[0] === 0) {
             return res.status(404).json({ message: "Tratamiento no encontrado para actualizar." });
        }

        res.status(200).json({ message: 'Tratamiento actualizado con éxito', ID: IDTratamiento });
        
    } catch (err) {
        console.error('Error al actualizar tratamiento:', err);
        res.status(500).json({ 
            message: 'Error en el servidor al actualizar el tratamiento.', 
            error: err.message 
        });
    }
};