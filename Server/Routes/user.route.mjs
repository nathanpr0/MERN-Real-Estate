import express from "express";
import UserController from "../Controllers/user.control.mjs";
const userRouter = express.Router();

// CREATE USER
userRouter.get("/", UserController.read());

export default userRouter;
