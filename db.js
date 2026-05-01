const sql = require("mssql");
require("dotenv").config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

if (process.env.DB_PORT) {
    dbConfig.port = Number(process.env.DB_PORT);
}

async function getConnection() {
    try {
        const pool = await sql.connect(dbConfig);
        return pool;
    } catch (error) {
        console.error("Veritabanı bağlantı hatası:", error);
        throw error;
    }
}

module.exports = {
    sql,
    getConnection
};