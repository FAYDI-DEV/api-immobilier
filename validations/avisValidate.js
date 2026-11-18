import { body, param } from "express-validator"

//Pour la creation (POST)
export const avisValidationRules = [
    body("proprieteId").isInt({ gt: 0 }).withMessage("proprieteId doit etre un entier positif"),
    body("note").isInt({ min: 1, max: 5 }).withMessage("La note doit etre un entier entre 1 et 5"),
    body("commentaire").optional().trim().isLength({ min: 5, max: 500 }).withMessage("Le commentaire doit avoir entre 5 et 500 caracteres")
]

//Pour la mise a jour (PUT)
export const avisUpdateRules = [
    param("id").isInt({ gt: 0 }).withMessage("L'id doit etre un entier positif"),
    body("note").optional().isInt({ min: 1, max: 5 }).withMessage("La note doit etre un entier entre 1 et 5"),
    body("commentaire").optional().trim().isLength({ min: 5, max: 500 }).withMessage("Le commentaire doit avoir entre 5 et 500 caracteres")
]

//Pour les routes avec un :id (GET, DELETE)
export const avisIdRules = [
    param("id").isInt({ gt: 0 }).withMessage("L'id doit etre un entier positif")
]
