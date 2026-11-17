import fs from "fs"
import path from "path"

//Transforme un fichier recu par Multer en URL publique : /uploads/nom.jpg
export const urlFichier = (file) => (file ? `/uploads/${file.filename}` : undefined)

//Supprime un fichier du dossier uploads (ex: si la validation echoue ou a la suppression)
export const supprimerFichier = (url) => {
    if (!url || !url.startsWith("/uploads/")) return
    const chemin = path.join(process.cwd(), url)
    fs.unlink(chemin, () => { }) // on ignore l'erreur si le fichier n'existe deja plus
}

//Supprime les fichiers uploades dans la requete courante
export const nettoyerUploads = (req) => {
    if (req.file) supprimerFichier(urlFichier(req.file))
    if (Array.isArray(req.files)) req.files.forEach(f => supprimerFichier(urlFichier(f)))
}
