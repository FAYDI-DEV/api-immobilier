import { Utilisateur, Role } from "../models/relation.js"

//Verifie que l'utilisateur connecte a un des roles demandes
//Utilisation : autorise(["admin", "agent"])  -> toujours APRES verifyToken
const autorise = (roles) => async (req, res, next) => {
    const id = req.user?.id
    if (!id) {
        return res.status(401).json({ message: "Accès refusé, utilisateur non authentifié" })
    }
    try {
        //On relit le role dans la base (au cas ou il a change depuis le login)
        const user = await Utilisateur.findByPk(id, { include: Role })
        if (!user) return res.status(401).json({ message: "Utilisateur introuvable" })

        const roleName = user.Role?.titre
        if (!roles.includes(roleName)) {
            return res.status(403).json({ message: "Accès refusé, rôle insuffisant" })
        }
        req.user.role = roleName
        next()
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export default autorise
