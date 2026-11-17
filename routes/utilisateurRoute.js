import { Router } from "express";
import {
    getAllUtilisateurs, getUtilisateurById, addUtilisateur,
    updateUtilisateur, deleteUtilisateur, utilisateurAnnonces
} from "../controllers/utilisateurController.js";
import { utilisateurValidationRules, utilisateurUpdateRules } from "../validations/utilisateurValidate.js";
import verifyToken from "../auth/verifyToken.js";
import autorise from "../auth/autorise.js";
import upload from "../config/multer.js";

const utilisateurRoute = Router()

utilisateurRoute
    //Inscription : publique (form-data, champ fichier "photo")
    .post("/", upload.single("photo"), utilisateurValidationRules, addUtilisateur)

    //Admin seulement
    .get("/", verifyToken, autorise(["admin"]), getAllUtilisateurs)
    .delete("/:id", verifyToken, autorise(["admin"]), deleteUtilisateur)

    //Soi-meme ou admin (verifie dans le controleur)
    .get("/:id", verifyToken, getUtilisateurById)
    .put("/:id", verifyToken, upload.single("photo"), utilisateurUpdateRules, updateUtilisateur)

    //Route de relation : annonces d'un agent (publique)
    .get("/:id/annonces", utilisateurAnnonces)

export default utilisateurRoute
