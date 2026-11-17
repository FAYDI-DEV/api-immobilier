import { validationResult } from "express-validator"
import bcrypt from "bcryptjs"
import { Utilisateur, Role, Propriete } from "../models/relation.js"
import { getPagination, pagedResponse } from "../utils/pagination.js"
import { urlFichier, supprimerFichier, nettoyerUploads } from "../utils/fichiers.js"

const sansMdp = { exclude: ["mdp"] }

//Liste des utilisateurs (admin) avec pagination
export const getAllUtilisateurs = async (req, res) => {
    const { page, limit, offset } = getPagination(req)
    try {
        const result = await Utilisateur.findAndCountAll({
            include: Role,
            attributes: sansMdp,
            limit, offset,
            order: [["id", "ASC"]]
        })
        res.status(200).json(pagedResponse(result, page, limit))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Details d'un utilisateur (soi-meme ou admin)
export const getUtilisateurById = async (req, res) => {
    const id = Number(req.params.id)
    if (req.user.id !== id && req.user.role !== "admin")
        return res.status(403).json({ message: "Accès refusé" })
    try {
        const user = await Utilisateur.findByPk(id, { include: Role, attributes: sansMdp })
        if (!user) return res.status(404).json({ message: "Utilisateur introuvable" })
        res.status(200).json({ data: user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Inscription d'un utilisateur (role client par defaut) + photo optionnelle
export const addUtilisateur = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        nettoyerUploads(req)
        return res.status(400).json({ errors: errors.array() })
    }

    const { mdp, roleId, ...restUser } = req.body // on ignore roleId : pas le droit de se donner un role
    try {
        const roleClient = await Role.findOne({ where: { titre: "client" } })
        const user = await Utilisateur.create({
            ...restUser,
            mdp: bcrypt.hashSync(mdp, 10),
            photo: urlFichier(req.file),
            roleId: roleClient?.id
        })
        const { mdp: passwd, ...data } = user.toJSON()
        res.status(201).json({ data, message: "Utilisateur cree avec succes" })
    } catch (error) {
        nettoyerUploads(req)
        res.status(400).json({ message: error.message })
    }
}

//Mise a jour (soi-meme ou admin). Seul l'admin peut changer le role.
export const updateUtilisateur = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        nettoyerUploads(req)
        return res.status(400).json({ errors: errors.array() })
    }
    const id = Number(req.params.id)
    if (req.user.id !== id && req.user.role !== "admin") {
        nettoyerUploads(req)
        return res.status(403).json({ message: "Accès refusé" })
    }

    const data = { ...req.body }
    if (req.user.role !== "admin") delete data.roleId
    if (data.mdp) data.mdp = bcrypt.hashSync(data.mdp, 10)

    try {
        const user = await Utilisateur.findByPk(id)
        if (!user) {
            nettoyerUploads(req)
            return res.status(404).json({ message: "Utilisateur introuvable" })
        }
        if (req.file) {
            supprimerFichier(user.photo) // on supprime l'ancienne photo
            data.photo = urlFichier(req.file)
        }
        await user.update(data)
        res.status(200).json({ message: "Mise a jour avec succes" })
    } catch (error) {
        nettoyerUploads(req)
        res.status(400).json({ message: error.message })
    }
}

//Suppression (admin)
export const deleteUtilisateur = async (req, res) => {
    try {
        const user = await Utilisateur.findByPk(req.params.id)
        if (!user) return res.status(404).json({ message: "Utilisateur introuvable" })
        supprimerFichier(user.photo)
        await user.destroy()
        res.status(200).json({ message: "Utilisateur supprime" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//Route de relation : les annonces publiees par un agent
export const utilisateurAnnonces = async (req, res) => {
    const { page, limit, offset } = getPagination(req)
    try {
        const result = await Propriete.findAndCountAll({
            where: { agentId: req.params.id },
            limit, offset,
            order: [["createdAt", "DESC"]]
        })
        res.status(200).json(pagedResponse(result, page, limit))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
