import { body, param } from "express-validator"

//Pour l'inscription (POST)
export const utilisateurValidationRules = [
    body("nom").trim().notEmpty().withMessage("Le nom ne peut pas etre vide"),
    body("prenom").trim().notEmpty().withMessage("Le prenom ne peut pas etre vide"),
    body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
    body("mdp").isLength({ min: 8 }).withMessage("Le mot de passe doit avoir au moins 8 caracteres"),
    body("telephone").optional().isMobilePhone("any").withMessage("Numero de telephone invalide")
]

//Pour la mise a jour (PUT) : tous les champs sont optionnels
export const utilisateurUpdateRules = [
    param("id").isInt({ gt: 0 }).withMessage("L'id doit etre un entier positif"),
    body("nom").optional().trim().notEmpty().withMessage("Le nom ne peut pas etre vide"),
    body("prenom").optional().trim().notEmpty().withMessage("Le prenom ne peut pas etre vide"),
    body("email").optional().isEmail().withMessage("Email invalide").normalizeEmail(),
    body("mdp").optional().isLength({ min: 8 }).withMessage("Le mot de passe doit avoir au moins 8 caracteres"),
    body("telephone").optional().isMobilePhone("any").withMessage("Numero de telephone invalide"),
    body("roleId").optional().isInt({ gt: 0 }).withMessage("roleId doit etre un entier positif")
]
