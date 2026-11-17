import database from "../config/connection.js";
import { DataTypes } from "sequelize";

const Propriete = database.define("Propriete", {
    titre: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    prix: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    adresse: { type: DataTypes.STRING, allowNull: false },
    ville: { type: DataTypes.STRING, allowNull: false },
    superficie: DataTypes.INTEGER, // en pieds carres
    chambres: { type: DataTypes.INTEGER, defaultValue: 0 },
    sallesBain: { type: DataTypes.INTEGER, defaultValue: 0 },
    statut: {
        type: DataTypes.ENUM("a vendre", "a louer", "vendue", "louee"),
        defaultValue: "a vendre"
    }
}, {
    timestamps: true // createdAt = date de publication de l'annonce
})

export default Propriete
