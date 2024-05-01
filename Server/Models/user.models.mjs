import mongoose from "mongoose";

const userScheme = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a UserName"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userScheme);
export default UserModel;
