import { validationResult } from "express-validator"
import { Op } from "sequelize"
import { Propriete, TypePropriete, Utilisateur, Photo, Visite, Avis } from "../models/relation.js"
import { getPagination, pagedResponse } from "../utils/pagination.js"
import { urlFichier, supprimerFichier, nettoyerUploads } from "../utils/fichiers.js"
import database from "../config/connection.js"

const includeDetails = [
    { model: TypePropriete },
    { model: Utilisateur, as: "agent", attributes: ["id", "nom", "prenom", "email", "telephone", "photo"] },
    { model: Photo }
]

//Verifie que l'utilisateur connecte est l'agent de l'annonce ou un admin
const peutModifier = (user, propriete) => user.role === "admin" || propriete.agentId === user.id

//Liste des proprietes avec filtres + pagination
//Ex: GET /api/proprietes?ville=Gatineau&prixMin=200000&prixMax=500000&typeId=1&statut=a vendre&page=1&limit=10
export const proprieteList = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { page, limit, offset } = getPagination(req)
    const { ville, prixMin, prixMax, typeId, statut, chambresMin } = req.query

    //Construction des filtres
    const where = {}
    if (ville) where.ville = ville
    if (typeId) where.typeId = typeId
    if (statut) where.statut = statut
    if (chambresMin) where.chambres = { [Op.gte]: chambresMin }
    if (prixMin || prixMax) {
        where.prix = {}
        if (prixMin) where.prix[Op.gte] = prixMin
        if (prixMax) where.prix[Op.lte] = prixMax
    }

    try {
        const result = await Propriete.findAndCountAll({
            where,
            include: includeDetails,
            distinct: true, // compte correct malgre le include des photos
            limit, offset,
            order: [["createdAt", "DESC"]]
        })
        res.status(200).json(pagedResponse(result, page, limit))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Details d'une propriete
export const proprieteById = async (req, res) => {
    try {
        const propriete = await Propriete.findByPk(req.params.id, { include: includeDetails })
        if (!propriete) return res.status(404).json({ message: "Propriete introuvable" })
        res.status(200).json({ data: propriete })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Ajout d'une propriete (agent/admin) + jusqu'a 10 photos (champ "photos")
export const addPropriete = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        nettoyerUploads(req)
        return res.status(400).json({ errors: errors.array() })
    }

    const { titre, description, prix, adresse, ville, superficie, chambres, sallesBain, statut, typeId } = req.body

    //Transaction : si une photo echoue, la propriete n'est pas creee non plus
    const t = await database.transaction()
    try {
        const type = await TypePropriete.findByPk(typeId)
        if (!type) {
            await t.rollback()
            nettoyerUploads(req)
            return res.status(400).json({ message: "typeId ne correspond a aucun type" })
        }

        const propriete = await Propriete.create({
            titre, description, prix, adresse, ville, superficie, chambres, sallesBain, statut, typeId,
            agentId: req.user.id // l'agent est celui qui est connecte
        }, { transaction: t })

        if (req.files?.length) {
            await Photo.bulkCreate(
                req.files.map(f => ({ url: urlFichier(f), proprieteId: propriete.id })),
                { transaction: t }
            )
        }
        await t.commit()

        const data = await Propriete.findByPk(propriete.id, { include: includeDetails })
        res.status(201).json({ data, message: "Propriete creee avec succes" })
    } catch (error) {
        await t.rollback()
        nettoyerUploads(req)
        res.status(400).json({ message: error.message })
    }
}

//Mise a jour d'une propriete (agent proprietaire ou admin)
export const updatePropriete = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
        const propriete = await Propriete.findByPk(req.params.id)
        if (!propriete) return res.status(404).json({ message: "Propriete introuvable" })
        if (!peutModifier(req.user, propriete))
            return res.status(403).json({ message: "Vous n'etes pas l'agent de cette annonce" })

        const { agentId, ...data } = req.body // on ne change pas l'agent via cette route
        await propriete.update(data)
        res.status(200).json({ data: propriete, message: "Mise a jour avec succes" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//Suppression d'une propriete (agent proprietaire ou admin) + ses photos
export const deletePropriete = async (req, res) => {
    try {
        const propriete = await Propriete.findByPk(req.params.id, { include: Photo })
        if (!propriete) return res.status(404).json({ message: "Propriete introuvable" })
        if (!peutModifier(req.user, propriete))
            return res.status(403).json({ message: "Vous n'etes pas l'agent de cette annonce" })

        propriete.Photos.forEach(p => supprimerFichier(p.url))
        await Photo.destroy({ where: { proprieteId: propriete.id } })
        await Visite.destroy({ where: { proprieteId: propriete.id } })
        await Avis.destroy({ where: { proprieteId: propriete.id } })
        await propriete.destroy()
        res.status(200).json({ message: "Propriete supprimee" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//Route de relation : les photos d'une propriete
export const proprietePhotos = async (req, res) => {
    try {
        const propriete = await Propriete.findByPk(req.params.id)
        if (!propriete) return res.status(404).json({ message: "Propriete introuvable" })
        const photos = await propriete.getPhotos()
        res.status(200).json({ data: photos })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
