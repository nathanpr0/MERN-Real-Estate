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

  delete() {
    return asyncHandler(async (req, res) => {
      try {
        // Find the listing by its ID
        const listing = await ListingModel.findById(req.params.id);

        // If the listing does not exist
        if (!listing) {
          return res.status(404).json({
            not_found: "Listing tidak ditemukan, gagal untuk menghapus data!",
          });
        }

        // Check if the listing was created by the current user
        if (listing["created_by_user"] !== req.user.id) {
          return res.status(401).json({
            error:
              "Unauthorized: You're not allowed to delete this listing. Your ID does not match.",
          });
        }

        // Delete the listing
        await ListingModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: "Data listing Anda berhasil dihapus" });
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }

  update() {
    return asyncHandler(async (req, res) => {
      try {
        const { id } = req.params;
        const listing = await ListingModel.findById(id);

        if (!listing) {
          return res.status(404).json({
            not_found: "Listing tidak ditemukan, gagal untuk menghapus data!",
          });
        }

        // Check if the listing was created by the current user
        if (listing["created_by_user"] !== req.user.id) {
          return res.status(401).json({
            error:
              "Unauthorized: You're not allowed to update this listing. Your ID does not match.",
          });
        }

        const response = await ListingModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(response);

        return;
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }

  get() {
    return asyncHandler(async (req, res) => {
      try {
        const response = await ListingModel.findById(req.params.id);

        if (!response) {
          return res.status(404).json({
            not_found: "Listing tidak ditemukan, gagal untuk menghapus data!",
          });
        }

        if (response["created_by_user" !== req.user.id]) {
          return res.status(401).json({
            error:
              "Unauthorized: You're not allowed to fetch this listing. Your ID does not match.",
          });
        }

        res.status(200).json(response);

        return;
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }
}
