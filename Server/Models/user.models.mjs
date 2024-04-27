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
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userScheme);
export default UserModel;
