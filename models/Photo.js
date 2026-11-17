import database from "../config/connection.js";
import { DataTypes } from "sequelize";

//Une propriete peut avoir plusieurs photos
const Photo = database.define("Photo", {
    url: { type: DataTypes.STRING, allowNull: false },
    legende: DataTypes.STRING
}, {
    timestamps: false
})

export default Photo
