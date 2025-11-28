import { getConnection, sql } from '../database/connection.js';

export const getTicket = async (req, res) => {
    const { IDPaciente, IDCita } = req.query; 

    if (!IDPaciente) {
        return res.status(400).json({ 
            message: 'Falta el parámetro obligatorio: IDPaciente.' 
        });
    }

    const pacienteID = parseInt(IDPaciente);
    const citaID = parseInt(IDCita);

    let pool;
    try {
        pool = await getConnection();
        const request = pool.request();
        
        request.input('IDPaciente', sql.Int, pacienteID);
        request.input('IDCita', sql.Int, citaID); 
        
        const result = await request.execute('sp_ObtenerTicketPago'); 
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ 
                message: `Ticket no encontrado para el paciente ID: ${pacienteID} y Cita ID: ${citaID}.` 
            });
        }

        res.status(200).json(result.recordset[0]);
        
    } catch (err) {
        console.error('Error al obtener el ticket:', err);
        res.status(500).json({ 
            message: 'Error en el servidor al obtener el ticket.', 
            error: err.message 
        });
    } 
};

export const crearTicket = async (req, res) => {
    const { IDPaciente, IDCita, Monto, Concepto } = req.body; 

    if (!IDPaciente || !Monto || !Concepto) {
        return res.status(400).json({ 
            message: 'Faltan campos obligatorios: IDPaciente, Monto y Concepto.' 
        });
    }

    let pool;
    try {
        pool = await getConnection();
        const request = pool.request();
        
        request.input('IDPaciente', sql.Int, parseInt(IDPaciente));
        request.input('IDCita', sql.Int, parseInt(IDCita));
        request.input('Monto', sql.Decimal(10, 2), parseFloat(Monto));
        request.input('Concepto', sql.NVarChar, Concepto);
        
        const result = await request.execute('sp_CrearTicketPago'); 
        
        res.status(201).json({ 
            message: 'Ticket de pago generado con éxito.',
            ID: result.recordset?.[0]?.ID || 'N/A'
        });
        
    } catch (err) {
        console.error('Error al crear el ticket:', err);
        res.status(500).json({ 
            message: 'Error en el servidor al crear el ticket.', 
            error: err.message 
        });
    } 
};

export const actualizarTicket = async (req, res) => {
    const { IDTicket, IDPaciente, Concepto, NuevoPago } = req.body; 

    if (!IDTicket || !IDPaciente || !Concepto) {
        return res.status(400).json({ 
            message: 'Faltan campos obligatorios para actualizar: IDTicket, IDPaciente, Monto y Concepto.' 
        });
    }

    let pool;
    try {
        pool = await getConnection();
        const request = pool.request();
        
        request.input('IDTicket', sql.Int, parseInt(IDTicket)); 
        request.input('IDPaciente', sql.Int, parseInt(IDPaciente));
        request.input('Concepto', sql.NVarChar, Concepto);
        request.input('NuevoPago', sql.Decimal(10, 2), parseFloat(NuevoPago));
        
        const result = await request.execute('sp_ActualizarTicketPago');
        
        if (result.rowsAffected[0] === 0) {
             return res.status(404).json({ message: "Ticket no encontrado para actualizar." });
        }

        res.status(200).json({ message: 'Ticket actualizado con éxito', ID: IDTicket });
        
    } catch (err) {
        console.error('Error al actualizar ticket:', err);
        res.status(500).json({ 
            message: 'Error en el servidor al actualizar el ticket.', 
            error: err.message 
        });
    }
};