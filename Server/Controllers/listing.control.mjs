import ListingModel from "../Models/listing.models.mjs";
import asyncHandler from "express-async-handler";

export default class listingController {
  create() {
    return asyncHandler(async (req, res) => {
      try {
        const response = await ListingModel.create(req.body);
        res.status(201).json(response);

        return;
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }
}
