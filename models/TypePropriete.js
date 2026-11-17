import database from "../config/connection.js";
import { DataTypes } from "sequelize";

//Maison, condo, terrain, appartement...
const TypePropriete = database.define("TypePropriete", {
    nom: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: DataTypes.TEXT,
    image: DataTypes.STRING
}, {
    tableName: "types_propriete",
    timestamps: false
})

export default TypePropriete
