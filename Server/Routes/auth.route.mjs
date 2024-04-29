import express from "express";
import AuthController from "../Controllers/auth.control.mjs";
const authRouter = express.Router();

// CREATE USER
authRouter.post("/signup", AuthController.signUp());

// LOGIN ACCOUNT
authRouter.post("/signin", AuthController.signIn());

export default authRouter;
