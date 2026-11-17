import { Router } from "express";
import { roleList, roleById, addRole, updateRole, deleteRole, roleUtilisateurs } from "../controllers/roleController.js";
import roleValidationRules from "../validations/roleValidate.js";
import verifyToken from "../auth/verifyToken.js";
import autorise from "../auth/autorise.js";

const roleRoute = Router()

//Toutes les routes des roles sont reservees a l'admin
roleRoute.use(verifyToken, autorise(["admin"]))

roleRoute
    .get("/", roleList)
    .get("/:id", roleById)
    .post("/", roleValidationRules, addRole)
    .put("/:id", roleValidationRules, updateRole)
    .delete("/:id", deleteRole)

    //Route de relation
    .get("/:id/utilisateurs", roleUtilisateurs)

export default roleRoute
