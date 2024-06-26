import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    regularPrice: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      required: true,
    },

    bathrooms: {
      type: Number,
      required: true,
    },

    bedrooms: {
      type: Number,
      required: true,
    },

    furnished: {
      type: Boolean,
      required: true,
    },

    parking: {
      type: Boolean,
      required: true,
    },

    types: {
      type: String,
      required: true,
    },

    offer: {
      type: Boolean,
      required: true,
    },

    lot: {
      type: String,
      required: true,
      enum: ["Rumah", "Apartemen"],
    },

    imagesURL: {
      type: Array,
      required: true,
    },

    created_by_user: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ListingModel = mongoose.model("Listing", listingSchema);
export default ListingModel;
