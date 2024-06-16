import ListingModel from "../Models/listing.models.mjs";
import UserModel from "../Models/user.models.mjs";
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
            not_found: "Listing tidak ditemukan!",
          });
        }

        if (response["created_by_user"] !== req.user.id) {
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

  fetch() {
    return asyncHandler(async (req, res) => {
      try {
        const response = await ListingModel.find()
          .sort({ createdAt: "desc" })
          .limit(3)
          .populate({
            path: "created_by_user",
            model: UserModel,
            select: ["username", "avatar"],
          });

        if (response.length === 0) {
          return res.status(404).json({
            not_found: "Listing tidak ditemukan!",
          });
        }

        res.status(200).json(response);
        return;
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }

  fetchDetails() {
    return asyncHandler(async (req, res) => {
      try {
        const response = await ListingModel.findById(req.params.id).populate({
          path: "created_by_user",
          model: UserModel,
          select: ["username", "avatar", "email"],
        });
        res.status(200).json(response);

        return;
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }

  fetchRecommend() {
    return asyncHandler(async (req, res) => {
      try {
        const { id } = req.params;
        const response = await ListingModel.find({ _id: { $ne: id } })
          .sort({ createdAt: "desc" })
          .limit(9)
          .populate({
            path: "created_by_user",
            model: UserModel,
            select: ["username", "avatar"],
          });

        if (response.length === 0) {
          return res.status(404).json({
            not_found: "Listing tidak ditemukan!",
          });
        }

        return res.status(200).json(response);
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }

  search() {
    return asyncHandler(async (req, res) => {
      try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        // FALSE NYA TIPE STRING DI KARENAKAN FRONT-END MENGUBAH SEARCH QUERYNYA JADI STRING
        // SEHINGGA BOOLEAN NYA KE CONVERT JADI STRING UNTUK REQUEST API KE SERVER
        let offer = req.query.offer;
        if (offer === undefined || offer === "false") {
          offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === "false") {
          furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;
        if (parking === undefined || parking === "false") {
          parking = { $in: [false, true] };
        }

        let types = req.query.types;
        if (types === undefined || types === "false") {
          types = { $in: ["Jual", "Sewa"] };
        }

        let lot = req.query.lot;
        if (lot === undefined || lot === "false") {
          lot = { $in: ["Rumah", "Apartemen"] };
        }

        const searchTerm = req.query.searchTerm || "";
        const sort = req.query.sort || "createdAt";
        const order = req.query.order || "desc";

        const listings = await ListingModel.find({
          name: { $regex: searchTerm, $options: "i" }, // MENGABAIKAN HURUF BESAR & KECIL
          offer,
          furnished,
          parking,
          types,
          lot,
        })
          .sort({ [sort]: order })
          .limit(limit)
          .skip(startIndex)
          .populate({
            path: "created_by_user",
            model: UserModel,
            select: ["username", "avatar"],
          });

        return res.status(200).json(listings);
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }
}
