import { body, param, query } from "express-validator"

const STATUTS = ["a vendre", "a louer", "vendue", "louee"]

//Pour la creation (POST)
export const proprieteValidationRules = [
    body("titre").trim().notEmpty().withMessage("Le titre est requis"),
    body("description").optional().isLength({ min: 20 }).withMessage("Il faut au moins 20 caracteres"),
    body("prix").isFloat({ gt: 0 }).withMessage("Le prix doit etre un nombre positif"),
    body("adresse").trim().notEmpty().withMessage("L'adresse est requise"),
    body("ville").trim().notEmpty().withMessage("La ville est requise"),
    body("superficie").optional().isInt({ gt: 0 }).withMessage("La superficie doit etre un entier positif"),
    body("chambres").optional().isInt({ min: 0 }).withMessage("Nombre de chambres invalide"),
    body("sallesBain").optional().isInt({ min: 0 }).withMessage("Nombre de salles de bain invalide"),
    body("statut").optional().isIn(STATUTS).withMessage(`Le statut doit etre : ${STATUTS.join(", ")}`),
    body("typeId").isInt({ gt: 0 }).withMessage("typeId doit etre un entier positif")
]

//Pour la mise a jour (PUT) : champs optionnels
export const proprieteUpdateRules = [
    param("id").isInt({ gt: 0 }).withMessage("L'id doit etre un entier positif"),
    body("titre").optional().trim().notEmpty().withMessage("Le titre ne peut pas etre vide"),
    body("description").optional().isLength({ min: 20 }).withMessage("Il faut au moins 20 caracteres"),
    body("prix").optional().isFloat({ gt: 0 }).withMessage("Le prix doit etre un nombre positif"),
    body("superficie").optional().isInt({ gt: 0 }).withMessage("La superficie doit etre un entier positif"),
    body("chambres").optional().isInt({ min: 0 }).withMessage("Nombre de chambres invalide"),
    body("sallesBain").optional().isInt({ min: 0 }).withMessage("Nombre de salles de bain invalide"),
    body("statut").optional().isIn(STATUTS).withMessage(`Le statut doit etre : ${STATUTS.join(", ")}`),
    body("typeId").optional().isInt({ gt: 0 }).withMessage("typeId doit etre un entier positif")
]

//Pour les filtres de recherche (GET /api/proprietes?ville=...&prixMin=...)
export const proprieteFiltreRules = [
    query("page").optional().isInt({ gt: 0 }).withMessage("page doit etre un entier positif"),
    query("limit").optional().isInt({ gt: 0, lt: 101 }).withMessage("limit doit etre entre 1 et 100"),
    query("prixMin").optional().isFloat({ min: 0 }).withMessage("prixMin invalide"),
    query("prixMax").optional().isFloat({ min: 0 }).withMessage("prixMax invalide"),
    query("typeId").optional().isInt({ gt: 0 }).withMessage("typeId invalide"),
    query("statut").optional().isIn(STATUTS).withMessage("statut invalide")
]
