//Importer le module de l'ORM
import { Sequelize } from "sequelize";
import dotenv from "dotenv"

// Nos variables d'environnement
dotenv.config()
const { DB_NAME, DB_USER, DB_PASSWORD, DB_DIALECT, DB_PORT, DB_HOST } = process.env

let database

if (DB_DIALECT === "sqlite") {
    // Option pratique pour tester sans XAMPP
    database = new Sequelize({ dialect: "sqlite", storage: "./database.sqlite", logging: false })
} else {
    database = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        dialect: DB_DIALECT || "mysql",
        port: DB_PORT,
        logging: false
    })
}

export default database
