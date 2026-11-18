import { validationResult } from "express-validator"
import { Avis, Propriete, Utilisateur } from "../models/relation.js"
import { getPagination, pagedResponse } from "../utils/pagination.js"

const includeAvis = [
    { model: Utilisateur, as: "auteur", attributes: ["id", "nom", "prenom", "photo"] },
    { model: Propriete, attributes: ["id", "titre", "ville"] }
]

//Liste des avis (filtre optionnel ?proprieteId=1) avec pagination + note moyenne
export const avisList = async (req, res) => {
    const { page, limit, offset } = getPagination(req)
    const where = req.query.proprieteId ? { proprieteId: req.query.proprieteId } : {}
    try {
        const result = await Avis.findAndCountAll({
            where, include: includeAvis, limit, offset,
            order: [["createdAt", "DESC"]]
        })
        const reponse = pagedResponse(result, page, limit)

        //Note moyenne quand on filtre sur une propriete
        if (req.query.proprieteId) {
            const moyenne = await Avis.findOne({
                where,
                attributes: [[Avis.sequelize.fn("AVG", Avis.sequelize.col("note")), "moyenne"]],
                raw: true
            })
            reponse.noteMoyenne = moyenne?.moyenne ? Number(Number(moyenne.moyenne).toFixed(1)) : null
        }
        res.status(200).json(reponse)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Details d'un avis
export const avisById = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    try {
        const avis = await Avis.findByPk(req.params.id, { include: includeAvis })
        if (!avis) return res.status(404).json({ message: "Avis introuvable" })
        res.status(200).json({ data: avis })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Donner un avis sur une propriete (un seul avis par utilisateur et par propriete)
export const addAvis = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { proprieteId, note, commentaire } = req.body
    try {
        const propriete = await Propriete.findByPk(proprieteId)
        if (!propriete) return res.status(404).json({ message: "Propriete introuvable" })

        const dejaFait = await Avis.findOne({ where: { proprieteId, utilisateurId: req.user.id } })
        if (dejaFait) return res.status(409).json({ message: "Vous avez deja donne un avis sur cette propriete" })

        const avis = await Avis.create({ proprieteId, note, commentaire, utilisateurId: req.user.id })
        res.status(201).json({ data: avis, message: "Avis ajoute avec succes" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//Modifier son avis (l'auteur seulement)
export const updateAvis = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    try {
        const avis = await Avis.findByPk(req.params.id)
        if (!avis) return res.status(404).json({ message: "Avis introuvable" })
        if (avis.utilisateurId !== req.user.id)
            return res.status(403).json({ message: "Vous ne pouvez modifier que vos propres avis" })

        const { note, commentaire } = req.body
        await avis.update({ note, commentaire })
        res.status(200).json({ data: avis, message: "Mise a jour avec succes" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//Supprimer un avis (l'auteur ou l'admin)
export const deleteAvis = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    try {
        const avis = await Avis.findByPk(req.params.id)
        if (!avis) return res.status(404).json({ message: "Avis introuvable" })
        if (avis.utilisateurId !== req.user.id && req.user.role !== "admin")
            return res.status(403).json({ message: "Accès refusé" })
        await avis.destroy()
        res.status(200).json({ message: "Avis supprime" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
