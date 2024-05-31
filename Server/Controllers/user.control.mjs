import UserModel from "../Models/user.models.mjs";
import ListingModel from "../Models/listing.models.mjs";
import asyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";

export default class UserController {
  static updateUserInfo() {
    return asyncHandler(async (req, res) => {
      // VERIFY COOKIE TOKENS BEFORE UPDATING
      const { id } = req.params;

      if (id !== req.user.id) {
        res.status(401).json({
          error: "Unauthorized: You're not allowed to update other accounts, ID does not match",
        });
      } else {
        const { username, email, avatar } = req.body;
        try {
          if (req.body["password"]) {
            req.body["password"] = bcryptjs.hashSync(req.body["password"], 10);
          }

          const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            {
              $set: {
                username: username,
                email: email,
                avatar: avatar,
              },
            },
            { new: true }
          );

          const { password, ...data } = updatedUser._doc;
          res.status(200).json(data);

          return;
        } catch (error) {
          throw new Error(error.message);
        }
      }
    });
  }

  static deleteUserInfo() {
    return asyncHandler(async (req, res) => {
      // VERIFY COOKIE TOKENS BEFORE DELETE THE ACCOUNT
      const { id } = req.params;
      if (id !== req.user.id) {
        res.status(401).json({
          error: "Unauthorized: You're not allowed to delete other accounts, ID does not match",
        });
      } else {
        try {
          await UserModel.findByIdAndDelete(id);
          await ListingModel.deleteMany({ created_by_user: id });
          res.clearCookie("Access_Token");
          res.status(200).json({ Delete: "User Has Been Deleted" });

          return;
        } catch (error) {
          throw new Error(error.message);
        }
      }
    });
  }

  static readUserListing() {
    return asyncHandler(async (req, res) => {
      const { id } = req.params;

      if (id !== req.user.id) {
        res.status(401).json({
          error:
            "Unauthorized: You're not allowed to get the User Listings Data, Your ID does not match",
        });
      } else {
        try {
          const response = await ListingModel.find({ created_by_user: id });
          res.status(200).json(response);
          return;
        } catch (error) {
          throw new Error(error.message);
        }
      }
    });
  }

  static getContact() {
    return asyncHandler(async (req, res) => {
      const { id } = req.params;

      try {
        const response = await UserModel.findById(id);

        if (!response) {
          return res.status(404).json({ error: "User Not Found" });
        }

        const { password: pass, ...user } = response._doc;
        res.status(200).json(user);

        return;
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }
}
