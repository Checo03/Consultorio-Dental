import { getConnection } from '../database/connection.js';
import { createHash } from 'crypto';

export const getDoctores = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Doctores');
    res.json(result.recordset);
};

const generateMD5Hash = (text) => {
    return createHash('md5').update(text).digest('hex');
};
export const loginDoctor = async (req, res) => {
    const { username, password } = req.body;
    const hashedPasswordMD5 = generateMD5Hash(password);

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("username", username)
            .input("password", hashedPasswordMD5)
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