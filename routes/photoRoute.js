import { Router } from "express";
import { photoList, photoById, addPhoto, updatePhoto, deletePhoto } from "../controllers/photoController.js";
import photoValidationRules from "../validations/photoValidate.js";
import verifyToken from "../auth/verifyToken.js";
import autorise from "../auth/autorise.js";
import upload from "../config/multer.js";

const photoRoute = Router()

photoRoute
    //Lecture publique
    .get("/", photoList)
    .get("/:id", photoById)

    //Ecriture : agent de l'annonce ou admin (form-data, champ fichier "image")
    .post("/", verifyToken, autorise(["agent", "admin"]), upload.single("image"), photoValidationRules, addPhoto)
    .put("/:id", verifyToken, autorise(["agent", "admin"]), updatePhoto)
    .delete("/:id", verifyToken, autorise(["agent", "admin"]), deletePhoto)

export default photoRoute
