import { body, param } from "express-validator"

export const favoriValidationRules = [
    body("proprieteId").isInt({ gt: 0 }).withMessage("proprieteId doit etre un entier positif")
]

export const favoriParamRules = [
    param("proprieteId").isInt({ gt: 0 }).withMessage("proprieteId doit etre un entier positif")
]
