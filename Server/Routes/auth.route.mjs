import express from "express";
import AuthController from "../Controllers/auth.control.mjs";
const authRouter = express.Router();

// CREATE USER
authRouter.post("/", AuthController.create());

export default authRouter;
