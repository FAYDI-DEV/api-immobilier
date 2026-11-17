import express from "express"
import helmet from "helmet"
import cors from "cors"
import compression from "compression"
import dotenv from "dotenv"
import multer from "multer"

//Importer les modeles (et leurs relations) pour creer les tables
import "./models/relation.js"
import database from "./config/connection.js";

//Importer les routes
import loginRoute from "./routes/loginRoute.js"
import roleRoute from "./routes/roleRoute.js"
import utilisateurRoute from "./routes/utilisateurRoute.js"
import typeProprieteRoute from "./routes/typeProprieteRoute.js"
import proprieteRoute from "./routes/proprieteRoute.js"
import photoRoute from "./routes/photoRoute.js"
import visiteRoute from "./routes/visiteRoute.js"
import favoriRoute from "./routes/favoriRoute.js"

dotenv.config()
const app = express()

//Middlewares
app.use(cors())
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } })) // pour afficher les images ailleurs
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Rendre les images accessibles : http://localhost:5000/uploads/nom.jpg
app.use("/uploads", express.static("uploads"))

//Creation / mise a jour des tables
try {
    await database.sync() // cree les tables qui n'existent pas encore
    // await database.sync({ alter: true }) //Mise a jour de la structure si vous modifiez un modele
    console.log("Base de donnees synchronisee")
} catch (error) {
    console.log(error)
}

//Routes
app.get("/", (req, res) => res.json({ message: "Bienvenue sur l'API immobiliere" }))
app.use("/api/login", loginRoute)
app.use("/api/roles", roleRoute)
app.use("/api/utilisateurs", utilisateurRoute)
app.use("/api/types", typeProprieteRoute)
app.use("/api/proprietes", proprieteRoute)
app.use("/api/photos", photoRoute)
app.use("/api/visites", visiteRoute)
app.use("/api/favoris", favoriRoute)

//Route inexistante
app.use((req, res) => res.status(404).json({ message: "Route introuvable" }))

//Gestion des erreurs (ex: erreurs de Multer : fichier trop gros, mauvais type)
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) return res.status(400).json({ message: err.message })
    res.status(400).json({ message: err.message })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Le serveur tourne sur le port ${PORT}`))
