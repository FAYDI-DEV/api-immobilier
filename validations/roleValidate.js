import { body, param } from "express-validator"

const roleValidationRules = [
    body("titre").trim().notEmpty().withMessage("Le titre du role est requis")
        .isLength({ max: 30 }).withMessage("30 caracteres maximum"),
    param("id").optional().isInt({ gt: 0 }).withMessage("L'id doit etre un entier positif")
]

export default roleValidationRules
