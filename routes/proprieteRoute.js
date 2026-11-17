import { Router } from "express";
import {
    proprieteList, proprieteById, addPropriete,
    updatePropriete, deletePropriete, proprietePhotos
} from "../controllers/proprieteController.js";
import { proprieteValidationRules, proprieteUpdateRules, proprieteFiltreRules } from "../validations/proprieteValidate.js";
import verifyToken from "../auth/verifyToken.js";
import autorise from "../auth/autorise.js";
import upload from "../config/multer.js";

const proprieteRoute = Router()

proprieteRoute
    //Lecture publique (avec filtres + pagination)
    .get("/", proprieteFiltreRules, proprieteList)
    .get("/:id", proprieteById)
    .get("/:id/photos", proprietePhotos)

    //Ecriture : agent ou admin (form-data, jusqu'a 10 fichiers dans le champ "photos")
    .post("/", verifyToken, autorise(["agent", "admin"]), upload.array("photos", 10), proprieteValidationRules, addPropriete)
    .put("/:id", verifyToken, autorise(["agent", "admin"]), proprieteUpdateRules, updatePropriete)
    .delete("/:id", verifyToken, autorise(["agent", "admin"]), deletePropriete)

export default proprieteRoute
