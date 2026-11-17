import { validationResult } from "express-validator"
import { Favori, Propriete, Photo } from "../models/relation.js"
import { getPagination, pagedResponse } from "../utils/pagination.js"

//Mes favoris (utilisateur connecte) avec pagination
export const mesFavoris = async (req, res) => {
    const { page, limit, offset } = getPagination(req)
    try {
        const result = await Favori.findAndCountAll({
            where: { utilisateurId: req.user.id },
            include: [{ model: Propriete, include: [Photo] }],
            distinct: true,
            limit, offset,
            order: [["createdAt", "DESC"]]
        })
        res.status(200).json(pagedResponse(result, page, limit))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Ajouter une propriete aux favoris
export const addFavori = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { proprieteId } = req.body
    try {
        const propriete = await Propriete.findByPk(proprieteId)
        if (!propriete) return res.status(404).json({ message: "Propriete introuvable" })

        //findOrCreate : evite les doublons
        const [favori, cree] = await Favori.findOrCreate({
            where: { utilisateurId: req.user.id, proprieteId }
        })
        if (!cree) return res.status(409).json({ message: "Deja dans vos favoris" })
        res.status(201).json({ data: favori, message: "Ajoute aux favoris" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//Retirer une propriete des favoris
export const deleteFavori = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    try {
        const nb = await Favori.destroy({
            where: { utilisateurId: req.user.id, proprieteId: req.params.proprieteId }
        })
        if (!nb) return res.status(404).json({ message: "Cette propriete n'est pas dans vos favoris" })
        res.status(200).json({ message: "Retire des favoris" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
