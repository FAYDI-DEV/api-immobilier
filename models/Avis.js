import database from "../config/connection.js";
import { DataTypes } from "sequelize";

//Avis d'un utilisateur sur une propriete : une note de 1 a 5 + un commentaire
const Avis = database.define("Avis", {
    note: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    commentaire: DataTypes.TEXT
}, {
    tableName: "avis",
    timestamps: true // createdAt = date de l'avis
})

export default Avis
