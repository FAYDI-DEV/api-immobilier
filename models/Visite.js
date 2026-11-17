import database from "../config/connection.js";
import { DataTypes } from "sequelize";

//Demande de visite d'une propriete par un client
const Visite = database.define("Visite", {
    dateVisite: { type: DataTypes.DATE, allowNull: false },
    message: DataTypes.TEXT,
    statut: {
        type: DataTypes.ENUM("en attente", "confirmee", "annulee"),
        defaultValue: "en attente"
    }
}, {
    timestamps: false
})

export default Visite
