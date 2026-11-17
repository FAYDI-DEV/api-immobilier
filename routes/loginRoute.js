import { Router } from "express";
import login from "../auth/login.js";
import loginValidationRules from "../validations/loginValidate.js";

const loginRoute = Router()

loginRoute.post("/", loginValidationRules, login)

export default loginRoute
