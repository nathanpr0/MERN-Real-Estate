import express from "express";
import UserController from "../Controllers/user.control.mjs";
import verifyToken from "../utils/verifyUser.mjs";
const userRouter = express.Router();

// UPDATE USER INFO
userRouter.put("/update/:id", verifyToken, UserController.updateUserInfo());

// DELETE USER ACCOUNT
userRouter.delete("/delete/:id", verifyToken, UserController.deleteUserInfo());

// READ USER CREATED LISTING
userRouter.get("/readlistings/:id", verifyToken, UserController.readUserListing());

export default userRouter;
