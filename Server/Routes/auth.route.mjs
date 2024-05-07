import express from "express";
import AuthController from "../Controllers/auth.control.mjs";
const authRouter = express.Router();
import verifyToken from "../utils/verifyUser.mjs";

// CREATE USER
authRouter.post("/signup", AuthController.signUp());

// LOGIN ACCOUNT
authRouter.post("/signin", AuthController.signIn());

// SIGN OUT
authRouter.get("/signout", AuthController.signOut());

// GOOGLE ACCOUNT
authRouter.post("/google", AuthController.google());

export default authRouter;
