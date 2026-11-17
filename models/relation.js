//Importer les modeles sans relations
import Role from "./Role.js";
import Utilisateur from "./Utilisateur.js";
import TypePropriete from "./TypePropriete.js";
import Propriete from "./Propriete.js";
import Photo from "./Photo.js";
import Visite from "./Visite.js";
import Favori from "./Favori.js";

//Ajouter les relations

// Un role a plusieurs utilisateurs (1-N)
Role.hasMany(Utilisateur, { foreignKey: "roleId" })
Utilisateur.belongsTo(Role, { foreignKey: "roleId" })

// Un agent (utilisateur) publie plusieurs proprietes (1-N)
Utilisateur.hasMany(Propriete, { foreignKey: "agentId", as: "annonces" })
Propriete.belongsTo(Utilisateur, { foreignKey: "agentId", as: "agent" })

// Un type regroupe plusieurs proprietes (1-N)
TypePropriete.hasMany(Propriete, { foreignKey: "typeId" })
Propriete.belongsTo(TypePropriete, { foreignKey: "typeId" })

// Une propriete a plusieurs photos (1-N)
Propriete.hasMany(Photo, { foreignKey: "proprieteId", onDelete: "CASCADE" })
Photo.belongsTo(Propriete, { foreignKey: "proprieteId" })

// Une propriete recoit plusieurs visites (1-N)
Propriete.hasMany(Visite, { foreignKey: "proprieteId", onDelete: "CASCADE" })
Visite.belongsTo(Propriete, { foreignKey: "proprieteId" })

// Un client demande plusieurs visites (1-N)
Utilisateur.hasMany(Visite, { foreignKey: "clientId", as: "visites" })
Visite.belongsTo(Utilisateur, { foreignKey: "clientId", as: "client" })

// Favoris : un utilisateur aime plusieurs proprietes et inversement (N-N)
Utilisateur.belongsToMany(Propriete, { through: Favori, foreignKey: "utilisateurId", otherKey: "proprieteId", as: "favoris" })
Propriete.belongsToMany(Utilisateur, { through: Favori, foreignKey: "proprieteId", otherKey: "utilisateurId", as: "fans" })
Favori.belongsTo(Utilisateur, { foreignKey: "utilisateurId" })
Favori.belongsTo(Propriete, { foreignKey: "proprieteId" })

export { Role, Utilisateur, TypePropriete, Propriete, Photo, Visite, Favori }
