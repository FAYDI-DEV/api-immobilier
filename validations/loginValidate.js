import { body } from "express-validator"

const loginValidationRules = [
    body("email").isEmail().withMessage("Email invalide"),
    body("mdp").notEmpty().withMessage("Le mot de passe est requis")
]

export default loginValidationRules
