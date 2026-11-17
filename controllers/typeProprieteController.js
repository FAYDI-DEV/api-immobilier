import { validationResult } from "express-validator"
import { TypePropriete, Propriete } from "../models/relation.js"
import { getPagination, pagedResponse } from "../utils/pagination.js"
import { urlFichier, supprimerFichier, nettoyerUploads } from "../utils/fichiers.js"

//Liste des types (pagination)
export const typeList = async (req, res) => {
    const { page, limit, offset } = getPagination(req)
    try {
        const result = await TypePropriete.findAndCountAll({ limit, offset, order: [["nom", "ASC"]] })
        res.status(200).json(pagedResponse(result, page, limit))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Details d'un type
export const typeById = async (req, res) => {
    try {
        const type = await TypePropriete.findByPk(req.params.id)
        if (!type) return res.status(404).json({ message: "Type introuvable" })
        res.status(200).json({ data: type })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Ajout d'un type + image optionnelle (champ "image")
export const addType = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        nettoyerUploads(req)
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const { nom, description } = req.body
        const result = await TypePropriete.create({ nom, description, image: urlFichier(req.file) })
        res.status(201).json({ data: result, message: "Type cree avec succes" })
    } catch (error) {
        nettoyerUploads(req)
        res.status(400).json({ message: error.message })
    }
}

//Mise a jour d'un type
export const updateType = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        nettoyerUploads(req)
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const type = await TypePropriete.findByPk(req.params.id)
        if (!type) {
            nettoyerUploads(req)
            return res.status(404).json({ message: "Type introuvable" })
        }
        const { nom, description } = req.body
        const data = { nom, description }
        if (req.file) {
            supprimerFichier(type.image)
            data.image = urlFichier(req.file)
        }
        await type.update(data)
        res.status(200).json({ data: type, message: "Mise a jour avec succes" })
    } catch (error) {
        nettoyerUploads(req)
        res.status(400).json({ message: error.message })
    }
}

//Suppression d'un type
export const deleteType = async (req, res) => {
    try {
        const type = await TypePropriete.findByPk(req.params.id)
        if (!type) return res.status(404).json({ message: "Type introuvable" })
        supprimerFichier(type.image)
        await type.destroy()
        res.status(200).json({ message: "Type supprime" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//Route de relation : les proprietes d'un type (pagination)
export const typeProprietes = async (req, res) => {
    const { page, limit, offset } = getPagination(req)
    try {
        const result = await Propriete.findAndCountAll({
            where: { typeId: req.params.id },
            limit, offset,
            order: [["createdAt", "DESC"]]
        })
        res.status(200).json(pagedResponse(result, page, limit))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
