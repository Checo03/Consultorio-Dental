import { getConnection, sql } from '../database/connection.js';

export const getHistorial = async (req, res) => {
    const { IDPaciente } = req.query; 

    if (!IDPaciente) {
        return res.status(400).json({ 
            message: 'Falta el parámetro obligatorio: IDPaciente.' 
        });
    }

    const pacienteID = parseInt(IDPaciente);
    if (isNaN(pacienteID)) {
        return res.status(400).json({ 
            message: 'El IDPaciente debe ser un número entero válido.' 
        });
    }

    let pool;
    try {
        pool = await getConnection();
        const request = pool.request();
        
        request.input('IDPaciente', sql.Int, pacienteID);
        const result = await request.execute('sp_ObtenerHistorialPorPaciente');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ 
                message: `Historial clínico no encontrado para el paciente ID: ${pacienteID}.` 
            });
        }

        res.status(200).json(result.recordset[0]);
        
    } catch (err) {
        console.error('Error al obtener historial clínico:', err);
        res.status(500).json({ 
            message: 'Error en el servidor al obtener el historial clínico.', 
            error: err.message 
        });
    } 
};

export const crearHistorial = async (req, res) => {
    const { 
        IDPaciente, 
        PresionArterial, 
        Enfermedades, 
        Origen, 
        Residencia, 
        Nacionalidad, 
        AntecedentesPatologicos, 
        AntecedentesGinecologicos, 
        Peso, 
        Temperatura, 
        Altura, 
        Glucosa, 
        HallazgosClinicos 
    } = req.body;

    if (!IDPaciente || !HallazgosClinicos) {
        return res.status(400).json({ 
            message: 'Faltan campos obligatorios para el registro de historial: ID del paciente, Fecha de consulta y Hallazgos Clínicos.' 
        });
    }

    let pool;
    try {
        pool = await getConnection();
        const request = pool.request();
        
        request.input('IDPaciente', sql.Int, IDPaciente);        
        request.input('PresionArterial', sql.NVarChar(50), PresionArterial); 
        request.input('Peso', sql.Decimal(10, 2), Peso || null);
        request.input('Altura', sql.Decimal(10, 2), Altura || null);
        request.input('Temperatura', sql.Decimal(10, 2), Temperatura || null);
        request.input('Glucosa', sql.Int, Glucosa || null);
        request.input('Origen', sql.NVarChar(100), Origen); 
        request.input('Residencia', sql.NVarChar(100), Residencia);
        request.input('Nacionalidad', sql.NVarChar(100), Nacionalidad);
        request.input('Enfermedades', sql.NVarChar(500), Enfermedades);
        request.input('AntecedentesPatologicos', sql.NVarChar(500), AntecedentesPatologicos); 
        request.input('AntecedentesGinecologicos', sql.NVarChar(500), AntecedentesGinecologicos);
        request.input('HallazgosClinicos', sql.NVarChar(500), HallazgosClinicos);

        const result = await request.execute('sp_CrearRegistroHistorial');
        

        res.status(201).json({
            message: 'Registro de historial clínico guardado exitosamente.',
        });
        
    } catch (err) {
        console.error('Error al guardar el historial clínico:', err);
        res.status(500).json({ 
            message: 'Error en el servidor al guardar el historial clínico.', 
            error: err.message 
        });
    } 
};

export const actualizarHistorial = async (req, res) => {
    const { 
        IDHistorial, IDPaciente, PresionArterial, Enfermedades, Origen, Residencia, Nacionalidad,
        AntecedentesPatologicos, AntecedentesGinecologicos, Peso, Temperatura, 
        Altura, Glucosa, HallazgosClinicos 
    } = req.body;

    if (!IDHistorial || !HallazgosClinicos) {
        return res.status(400).json({ 
            message: 'Faltan campos obligatorios para la actualización (IDHistorial y HallazgosClínicos).' 
        });
    }

    let pool;
    try {
        pool = await getConnection();
        const request = pool.request();

        request.input('IDHistorial', sql.Int, parseInt(IDHistorial));
        request.input('IDPaciente', sql.Int, parseInt(IDPaciente));
        request.input('PresionArterial', sql.NVarChar, PresionArterial);
        request.input('Enfermedades', sql.NVarChar, Enfermedades);
        request.input('Origen', sql.NVarChar, Origen);
        request.input('Residencia', sql.NVarChar, Residencia);
        request.input('Nacionalidad', sql.NVarChar, Nacionalidad);
        request.input('AntecedentesPatologicos', sql.NVarChar, AntecedentesPatologicos);
        request.input('AntecedentesGinecologicos', sql.NVarChar, AntecedentesGinecologicos);
        request.input('Peso', sql.Decimal(5, 2), Peso);
        request.input('Temperatura', sql.Decimal(3, 1), Temperatura);
        request.input('Altura', sql.Decimal(3, 2), Altura);
        request.input('Glucosa', sql.Decimal(5, 2), Glucosa);
        request.input('HallazgosClinicos', sql.NVarChar, HallazgosClinicos);

        const result = await request.execute('sp_ActualizarHistorial');
        
        if (result.rowsAffected[0] === 0) {
             return res.status(404).json({ message: "Historial no encontrado para actualizar." });
        }

        res.status(200).json({ message: 'Historial actualizado con éxito', ID: IDHistorial });
        
    } catch (err) {
        console.error('Error al actualizar historial (POST):', err);
        res.status(500).json({ 
            message: 'Error en el servidor al actualizar el historial.', 
            error: err.message 
        });
    }
};