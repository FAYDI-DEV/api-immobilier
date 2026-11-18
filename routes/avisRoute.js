import { Router } from "express";
import { avisList, avisById, addAvis, updateAvis, deleteAvis } from "../controllers/avisController.js";
import { avisValidationRules, avisUpdateRules, avisIdRules } from "../validations/avisValidate.js";
import verifyToken from "../auth/verifyToken.js";
import autorise from "../auth/autorise.js";

const avisRoute = Router()

avisRoute
    //Lecture publique (pagination + filtre ?proprieteId=)
    .get("/", avisList)
    .get("/:id", avisIdRules, avisById)

    //Ecriture : utilisateur connecte
    .post("/", verifyToken, autorise(["client", "admin"]), avisValidationRules, addAvis)
    .put("/:id", verifyToken, avisUpdateRules, updateAvis)
    .delete("/:id", verifyToken, avisIdRules, deleteAvis)

export default avisRoute
