const express = require('express');
const cors = require('cors');


// Conexión a SQL Server usando mssql
const sql = require('mssql');

const dbConfig = {
  user: '',
  password: '',
  server: 'Latop_Sergio\\SQLEXPRESS',
  database: 'SistemaDental',
  options: {
    trustServerCertificate: true,
    encrypt: false
  }
};


// Función reutilizable para obtener conexión
async function getConnection() {
  try {
    const pool = await sql.connect(dbConfig);
    return pool;
  } catch (err) {
    throw err;
  }
}

const app = express();
const PORT = 3001; 

app.use(cors());
app.use(express.json()); 

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});

// Ejemplo de ruta que usa la conexión
app.get('/api/pacientes', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Paciente');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para consultar citas con datos de paciente
app.get('/api/citas', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT Cita.ID, Cita.Fecha, Cita.Estado, Paciente.Nombre AS NombrePaciente
      FROM Cita
      INNER JOIN Paciente ON Cita.IDPaciente = Paciente.ID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aquí puedes agregar más rutas para tu API


app.listen(PORT, async () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
  try {
    await getConnection();
    console.log('Conexión a la base de datos exitosa');
  } catch (err) {
    console.error('Error al conectar a la base de datos:', JSON.stringify(err, null, 2));
    if (err.stack) console.error('Stack:', err.stack);
  }
});

