import jwt from "jsonwebtoken"

//Verifie que la requete contient un token valide : Authorization: Bearer <token>
const verifyToken = (req, res, next) => {
    const bearerToken = req.headers["authorization"]
    if (!bearerToken) {
        return res.status(401).json({ message: "Accès refusé, token manquant" })
    }
    const token = bearerToken.split(" ")[1]

    jwt.verify(token, process.env.CODE_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: err.message })
        req.user = decoded // { id, prenom, role }
        next()
    })
}

export default verifyToken
