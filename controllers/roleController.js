import { validationResult } from "express-validator"
import { Role, Utilisateur } from "../models/relation.js"

//Liste des roles
export const roleList = async (req, res) => {
    try {
        const data = await Role.findAll()
        res.status(200).json({ data })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Details d'un role
export const roleById = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id)
        if (!role) return res.status(404).json({ message: "Role introuvable" })
        res.status(200).json({ data: role })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//Ajout d'un role
export const addRole = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    try {
        const result = await Role.create({ titre: req.body.titre })
        res.status(201).json({ data: result, message: "Role cree avec succes" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//Mise a jour d'un role
export const updateRole = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    try {
        const [nb] = await Role.update({ titre: req.body.titre }, { where: { id: req.params.id } })
        if (!nb) return res.status(404).json({ message: "Role introuvable" })
        res.status(200).json({ message: "Mise a jour avec succes" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//Suppression d'un role
export const deleteRole = async (req, res) => {
    try {
        const nb = await Role.destroy({ where: { id: req.params.id } })
        if (!nb) return res.status(404).json({ message: "Role introuvable" })
        res.status(200).json({ message: "Role supprime" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//Route de relation : les utilisateurs d'un role
export const roleUtilisateurs = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id)
        if (!role) return res.status(404).json({ message: "Role introuvable" })
        const users = await role.getUtilisateurs({ attributes: { exclude: ["mdp"] } })
        res.status(200).json({ data: users })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
