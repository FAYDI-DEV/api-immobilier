import { body, param } from "express-validator"

const photoValidationRules = [
    body("proprieteId").isInt({ gt: 0 }).withMessage("proprieteId doit etre un entier positif"),
    body("legende").optional().isLength({ max: 150 }).withMessage("150 caracteres maximum"),
    param("id").optional().isInt({ gt: 0 }).withMessage("L'id doit etre un entier positif")
]

export default photoValidationRules
