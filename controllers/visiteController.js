import { validationResult } from "express-validator"
import { Visite, Propriete, Utilisateur } from "../models/relation.js"
import { getPagination, pagedResponse } from "../utils/pagination.js"

const includeVisite = [
    { model: Propriete, attributes: ["id", "titre", "adresse", "ville", "agentId"] },
    { model: Utilisateur, as: "client", attributes: ["id", "nom", "prenom", "email", "telephone"] }
]

//Liste des visites : admin = toutes, agent = celles de ses annonces (pagination)
export const visiteList = async (req, res) => {
    const { page, limit, offset } = getPagination(req)
    const include = [...includeVisite]
    if (req.user.role === "agent") {
        include[0] = { ...include[0], where: { agentId: req.user.id } }
    }
    try {
        const result = await Visite.findAndCountAll({
            include, limit, offset,
            order: [["dateVisite", "ASC"]]
        })
        res.status(200).json(pagedResponse(result, page, limit))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Mes visites (client connecte)
export const mesVisites = async (req, res) => {
    const { page, limit, offset } = getPagination(req)
    try {
        const result = await Visite.findAndCountAll({
            where: { clientId: req.user.id },
            include: includeVisite,
            limit, offset,
            order: [["dateVisite", "ASC"]]
        })
        res.status(200).json(pagedResponse(result, page, limit))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Details d'une visite (client concerne, agent de l'annonce ou admin)
export const visiteById = async (req, res) => {
    try {
        const visite = await Visite.findByPk(req.params.id, { include: includeVisite })
        if (!visite) return res.status(404).json({ message: "Visite introuvable" })
        const { id, role } = req.user
        if (role !== "admin" && visite.clientId !== id && visite.Propriete.agentId !== id)
            return res.status(403).json({ message: "Accès refusé" })
        res.status(200).json({ data: visite })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Demander une visite (client connecte)
export const addVisite = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { proprieteId, dateVisite, message } = req.body
    try {
        const propriete = await Propriete.findByPk(proprieteId)
        if (!propriete) return res.status(404).json({ message: "Propriete introuvable" })

        const visite = await Visite.create({
            proprieteId, dateVisite, message,
            clientId: req.user.id
        })
        res.status(201).json({ data: visite, message: "Demande de visite envoyee" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//Changer le statut d'une visite (agent de l'annonce ou admin)
export const updateStatutVisite = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    try {
        const visite = await Visite.findByPk(req.params.id, { include: Propriete })
        if (!visite) return res.status(404).json({ message: "Visite introuvable" })
        if (req.user.role !== "admin" && visite.Propriete.agentId !== req.user.id)
            return res.status(403).json({ message: "Vous n'etes pas l'agent de cette annonce" })
        await visite.update({ statut: req.body.statut })
        res.status(200).json({ data: visite, message: "Statut mis a jour" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//Annuler / supprimer une visite (le client qui l'a demandee ou admin)
export const deleteVisite = async (req, res) => {
    try {
        const visite = await Visite.findByPk(req.params.id)
        if (!visite) return res.status(404).json({ message: "Visite introuvable" })
        if (req.user.role !== "admin" && visite.clientId !== req.user.id)
            return res.status(403).json({ message: "Accès refusé" })
        await visite.destroy()
        res.status(200).json({ message: "Visite supprimee" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
