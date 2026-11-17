import { Router } from "express";
import {
    visiteList, mesVisites, visiteById, addVisite,
    updateStatutVisite, deleteVisite
} from "../controllers/visiteController.js";
import { visiteValidationRules, visiteStatutRules } from "../validations/visiteValidate.js";
import verifyToken from "../auth/verifyToken.js";
import autorise from "../auth/autorise.js";

const visiteRoute = Router()

//Toutes les routes de visites demandent d'etre connecte
visiteRoute.use(verifyToken)

visiteRoute
    .get("/", autorise(["agent", "admin"]), visiteList)
    .get("/mes-visites", mesVisites) // AVANT "/:id"
    .get("/:id", visiteById)
    .post("/", autorise(["client", "admin"]), visiteValidationRules, addVisite)
    .put("/:id/statut", autorise(["agent", "admin"]), visiteStatutRules, updateStatutVisite)
    .delete("/:id", deleteVisite)

export default visiteRoute
