import express from "express";
import verifyToken from "../utils/verifyUser.mjs";
import listingController from "../Controllers/listing.control.mjs";

const listingControl = new listingController();
const listingRouter = express.Router();

listingRouter.post("/create", verifyToken, listingControl.create());
listingRouter.delete("/delete/:id", verifyToken, listingControl.delete());
listingRouter.put("/update/:id", verifyToken, listingControl.update());

export default listingRouter;
