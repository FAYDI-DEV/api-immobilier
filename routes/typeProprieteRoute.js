import { Router } from "express";
import { typeList, typeById, addType, updateType, deleteType, typeProprietes } from "../controllers/typeProprieteController.js";
import typeProprieteValidationRules from "../validations/typeProprieteValidate.js";
import verifyToken from "../auth/verifyToken.js";
import autorise from "../auth/autorise.js";
import upload from "../config/multer.js";

const typeProprieteRoute = Router()

typeProprieteRoute
    //Lecture publique
    .get("/", typeList)
    .get("/:id", typeById)
    .get("/:id/proprietes", typeProprietes)

    //Ecriture : admin seulement (form-data, champ fichier "image")
    .post("/", verifyToken, autorise(["admin"]), upload.single("image"), typeProprieteValidationRules, addType)
    .put("/:id", verifyToken, autorise(["admin"]), upload.single("image"), typeProprieteValidationRules, updateType)
    .delete("/:id", verifyToken, autorise(["admin"]), deleteType)

export default typeProprieteRoute
