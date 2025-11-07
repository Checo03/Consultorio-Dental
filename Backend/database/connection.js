import sql from "mssql";

const dbSettings = {
    user: "Dev",
    password: "123456",
    server: "localhost", 
    database: "SistemaDental",
    options: {
        encrypt : true,
        trustServerCertificate: true,
    },
};

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