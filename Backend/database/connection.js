import sql from "mssql";
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { fileURLToPath } from 'url';

const ENCRYPTION_KEY = '%0OO24YGBrcSHkIa'; 
const ALGORITHM = 'aes-256-cbc'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const encryptedFile = path.join(__dirname, 'connection.enc');
const key = crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest('base64').substring(0, 32);

// Función de desencriptación
function decrypt(combinedData) {
    try {
        const iv = Buffer.from(combinedData.slice(0, 32), 'hex');
        const encryptedText = combinedData.slice(32);

        // Crear el descifrador
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key), iv);

        // Descifrar
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return JSON.parse(decrypted);

    } catch (error) {
        console.error("¡Error al descifrar la configuración!");
        throw new Error("Fallo de seguridad: No se pudo leer la configuración de BD.");
    }
}

// Leer y Descifrar la configuración al inicio del módulo
let dbSettings = {};
try {
    const encryptedConfig = fs.readFileSync(encryptedFile, 'utf8');
    dbSettings = decrypt(encryptedConfig);
} catch (e) {
    console.error("No se encontró el archivo de configuración cifrado:", e.message);
}


export async function getConnection() {
    
    try {
        const pool = await sql.connect(dbSettings); 
        console.log("Conexión a la base de datos exitosa");
        return pool;
    } catch (error) {
        console.error(error);
        console.log("Error de conexión a la base de datos");
    }
}

export { sql };