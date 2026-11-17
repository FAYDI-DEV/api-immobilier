import { body, param } from "express-validator"

//Demande de visite par un client
export const visiteValidationRules = [
    body("proprieteId").isInt({ gt: 0 }).withMessage("proprieteId doit etre un entier positif"),
    body("dateVisite").isISO8601().withMessage("Date invalide (format : 2026-12-01T14:00)")
        .custom(value => new Date(value) > new Date()).withMessage("La date de visite doit etre dans le futur"),
    body("message").optional().isLength({ max: 500 }).withMessage("500 caracteres maximum")
]

//Changement de statut par l'agent
export const visiteStatutRules = [
    param("id").isInt({ gt: 0 }).withMessage("L'id doit etre un entier positif"),
    body("statut").isIn(["en attente", "confirmee", "annulee"])
        .withMessage("Le statut doit etre : en attente, confirmee ou annulee")
]
