// doctores.controller.js
import { getConnection } from '../database/connection.js';

export const getDoctores = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Doctores');
    res.json(result.recordset);
};

export const loginDoctor = async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("username", username)
            .input("password", password)
            .query("SELECT * FROM Doctores WHERE Correo = @username AND Contrasena = @password");

        if (result.recordset.length > 0) {
            res.json({ success: true, doctor: result.recordset[0] });
        } else {
            res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};