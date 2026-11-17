import database from "../config/connection.js";
import { DataTypes } from "sequelize";

const Utilisateur = database.define("Utilisateur", {
    nom: { type: DataTypes.STRING, allowNull: false },
    prenom: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    mdp: { type: DataTypes.STRING, allowNull: false },
    telephone: DataTypes.STRING,
    photo: DataTypes.STRING
}, {
    timestamps: false
})

export default Utilisateur
