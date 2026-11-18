//Script pour remplir la base avec des donnees de depart
//Lancer avec : npm run seed
import bcrypt from "bcryptjs"
import database from "./config/connection.js"
import { Role, Utilisateur, TypePropriete, Propriete, Avis } from "./models/relation.js"

try {
    await database.sync()

    //1. Les roles
    const [admin] = await Role.findOrCreate({ where: { titre: "admin" } })
    const [agent] = await Role.findOrCreate({ where: { titre: "agent" } })
    const [client] = await Role.findOrCreate({ where: { titre: "client" } })

    //2. Des utilisateurs de test (mot de passe : Password123)
    const mdp = bcrypt.hashSync("Password123", 10)
    const [userAdmin] = await Utilisateur.findOrCreate({
        where: { email: "admin@immo.ca" },
        defaults: { nom: "Admin", prenom: "Super", mdp, roleId: admin.id }
    })
    const [userAgent] = await Utilisateur.findOrCreate({
        where: { email: "agent@immo.ca" },
        defaults: { nom: "Tremblay", prenom: "Julie", mdp, telephone: "8195551234", roleId: agent.id }
    })
    const [userClient] = await Utilisateur.findOrCreate({
        where: { email: "client@immo.ca" },
        defaults: { nom: "Gagnon", prenom: "Marc", mdp, roleId: client.id }
    })

    //3. Les types de propriete
    const types = {}
    for (const nom of ["Maison", "Condo", "Appartement", "Terrain", "Commercial"]) {
        const [t] = await TypePropriete.findOrCreate({ where: { nom } })
        types[nom] = t
    }

    //4. Quelques annonces
    if (await Propriete.count() === 0) {
        await Propriete.bulkCreate([
            { titre: "Maison familiale a Aylmer", description: "Belle maison renovee avec grande cour arriere, proche des ecoles.", prix: 549000, adresse: "123 rue Principale", ville: "Gatineau", superficie: 1800, chambres: 4, sallesBain: 2, statut: "a vendre", typeId: types.Maison.id, agentId: userAgent.id },
            { titre: "Condo moderne au centre-ville", description: "Condo lumineux avec vue sur la riviere, stationnement inclus.", prix: 389000, adresse: "45 rue Laurier", ville: "Gatineau", superficie: 900, chambres: 2, sallesBain: 1, statut: "a vendre", typeId: types.Condo.id, agentId: userAgent.id },
            { titre: "4 1/2 a louer pres de La Cite", description: "Appartement spacieux, chauffe et eclaire, pres du transport en commun.", prix: 1650, adresse: "801 promenade de l'Aviation", ville: "Ottawa", superficie: 1000, chambres: 2, sallesBain: 1, statut: "a louer", typeId: types.Appartement.id, agentId: userAgent.id }
        ])
    }

    //5. Un avis de depart
    if (await Avis.count() === 0) {
        const premiere = await Propriete.findOne({ order: [["id", "ASC"]] })
        await Avis.create({ note: 5, commentaire: "Tres belle maison, agent tres disponible.", proprieteId: premiere.id, utilisateurId: userClient.id })
    }

    console.log("Donnees de depart creees ✅")
    console.log("Comptes de test (mot de passe : Password123) : admin@immo.ca, agent@immo.ca, client@immo.ca")
    process.exit(0)
} catch (error) {
    console.log(error)
    process.exit(1)
}
