import { Router } from "express";
import { mesFavoris, addFavori, deleteFavori } from "../controllers/favoriController.js";
import { favoriValidationRules, favoriParamRules } from "../validations/favoriValidate.js";
import verifyToken from "../auth/verifyToken.js";

const favoriRoute = Router()

//Chaque utilisateur connecte gere ses propres favoris
favoriRoute.use(verifyToken)

favoriRoute
    .get("/", mesFavoris)
    .post("/", favoriValidationRules, addFavori)
    .delete("/:proprieteId", favoriParamRules, deleteFavori)

export default favoriRoute
