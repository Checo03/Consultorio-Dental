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
        return pool;
    } catch (error) {
        console.error(error);
    }
}