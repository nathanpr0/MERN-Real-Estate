import express from "express";
import verifyToken from "../utils/verifyUser.mjs";
import listingController from "../Controllers/listing.control.mjs";

const listingControl = new listingController();
const listingRouter = express.Router();

listingRouter.post("/create", verifyToken, listingControl.create());
listingRouter.delete("/delete/:id", verifyToken, listingControl.delete());
listingRouter.put("/update/:id", verifyToken, listingControl.update());
listingRouter.get("/get/:id", verifyToken, listingControl.get());

// FETCHING LISTING FOR MAIN PAGE
listingRouter.get("/fetchlistings", listingControl.fetch());
listingRouter.get("/fetchlistingsdetails/:id", listingControl.fetchDetails());
listingRouter.get("/fetchlistingsrecommend/:id", listingControl.fetchRecommend());

// SEARCH LISTING
listingRouter.get("/search", listingControl.search());

export default listingRouter;
