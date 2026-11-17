import database from "../config/connection.js";
import { DataTypes } from "sequelize";

//Table d'association entre Utilisateur et Propriete (N-N)
const Favori = database.define("Favori", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
}, {
    timestamps: true, // createdAt = date d'ajout aux favoris
    updatedAt: false
})

export default Favori
