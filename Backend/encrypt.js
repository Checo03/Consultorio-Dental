import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { fileURLToPath } from 'url';

const ENCRYPTION_KEY = '%0OO24YGBrcSHkIa'; 
const ALGORITHM = 'aes-256-cbc'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputFile = path.join(__dirname, 'database', 'dbconfig.json');
const outputFile = path.join(__dirname, 'database', 'connection.enc');

const key = crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest('base64').substring(0, 32);

function encryptFile() {
    try {
        const data = fs.readFileSync(inputFile, 'utf8');

        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv);

        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const combined = iv.toString('hex') + encrypted;

        fs.writeFileSync(outputFile, combined);

        console.log(`Archivo cifrado con éxito: ${outputFile}`);

    } catch (error) {
        console.error("Error durante el cifrado:", error.message);
        console.error("Asegúrate de que el archivo database/dbconfig.json exista.");
    }
}

encryptFile();