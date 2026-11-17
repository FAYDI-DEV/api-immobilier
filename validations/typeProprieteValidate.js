import { body, param } from "express-validator"

const typeProprieteValidationRules = [
    body("nom").trim().notEmpty().withMessage("Le nom ne peut pas etre vide"),
    body("description").optional().isLength({ min: 10 }).withMessage("Il faut au moins 10 caracteres"),
    param("id").optional().isInt({ gt: 0 }).withMessage("L'id doit etre un entier positif")
]

export default typeProprieteValidationRules
