import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import { Utilisateur, Role } from "../models/relation.js"

const login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { email, mdp } = req.body

    try {
        const user = await Utilisateur.findOne({ where: { email }, include: Role })

        if (!user) return res.status(401).json({ message: "Email et/ou mot de passe incorrect" })
        const mdpValid = bcrypt.compareSync(mdp, user.mdp)

        if (!mdpValid) return res.status(401).json({ message: "Email et/ou mot de passe incorrect" })

        //Creation des informations a mettre dans le jeton
        const payload = { id: user.id, prenom: user.prenom, role: user.Role?.titre }
        const token = jwt.sign(payload, process.env.CODE_SECRET, { expiresIn: "8h" })

        //Ne jamais renvoyer le mot de passe
        const { mdp: passwd, ...restUser } = user.toJSON()
        res.status(200).json({ data: { user: restUser, token } })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export default login
