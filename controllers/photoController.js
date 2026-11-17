import { validationResult } from "express-validator"
import { Photo, Propriete } from "../models/relation.js"
import { getPagination, pagedResponse } from "../utils/pagination.js"
import { urlFichier, supprimerFichier, nettoyerUploads } from "../utils/fichiers.js"

//Liste des photos (filtre optionnel ?proprieteId=1) avec pagination
export const photoList = async (req, res) => {
    const { page, limit, offset } = getPagination(req)
    const where = req.query.proprieteId ? { proprieteId: req.query.proprieteId } : {}
    try {
        const result = await Photo.findAndCountAll({ where, limit, offset })
        res.status(200).json(pagedResponse(result, page, limit))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Details d'une photo
export const photoById = async (req, res) => {
    try {
        const photo = await Photo.findByPk(req.params.id, { include: Propriete })
        if (!photo) return res.status(404).json({ message: "Photo introuvable" })
        res.status(200).json({ data: photo })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Ajout d'une photo a une propriete (fichier obligatoire, champ "image")
export const addPhoto = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        nettoyerUploads(req)
        return res.status(400).json({ errors: errors.array() })
    }
    if (!req.file) return res.status(400).json({ message: "Le fichier image est obligatoire (champ 'image')" })

    try {
        const propriete = await Propriete.findByPk(req.body.proprieteId)
        if (!propriete) {
            nettoyerUploads(req)
            return res.status(404).json({ message: "Propriete introuvable" })
        }
        if (req.user.role !== "admin" && propriete.agentId !== req.user.id) {
            nettoyerUploads(req)
            return res.status(403).json({ message: "Vous n'etes pas l'agent de cette annonce" })
        }
        const photo = await Photo.create({
            url: urlFichier(req.file),
            legende: req.body.legende,
            proprieteId: propriete.id
        })
        res.status(201).json({ data: photo, message: "Photo ajoutee avec succes" })
    } catch (error) {
        nettoyerUploads(req)
        res.status(400).json({ message: error.message })
    }
}

//Mise a jour de la legende d'une photo
export const updatePhoto = async (req, res) => {
    try {
        const photo = await Photo.findByPk(req.params.id, { include: Propriete })
        if (!photo) return res.status(404).json({ message: "Photo introuvable" })
        if (req.user.role !== "admin" && photo.Propriete.agentId !== req.user.id)
            return res.status(403).json({ message: "Accès refusé" })
        await photo.update({ legende: req.body.legende })
        res.status(200).json({ data: photo, message: "Mise a jour avec succes" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//Suppression d'une photo (et du fichier)
export const deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findByPk(req.params.id, { include: Propriete })
        if (!photo) return res.status(404).json({ message: "Photo introuvable" })
        if (req.user.role !== "admin" && photo.Propriete.agentId !== req.user.id)
            return res.status(403).json({ message: "Accès refusé" })
        supprimerFichier(photo.url)
        await photo.destroy()
        res.status(200).json({ message: "Photo supprimee" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
