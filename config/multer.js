//Configuration de Multer pour l'upload des images
import multer from "multer"
import path from "path"

//Ou et comment enregistrer les fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        //Nom unique : date + nombre aleatoire + extension d'origine
        const nomUnique = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, nomUnique + path.extname(file.originalname).toLowerCase())
    }
})

//Accepter seulement les images
const fileFilter = (req, file, cb) => {
    const typesAcceptes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (typesAcceptes.includes(file.mimetype)) cb(null, true)
    else cb(new Error("Seules les images (jpg, png, webp, gif) sont acceptees"))
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 Mo maximum
})

export default upload
