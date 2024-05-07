import UserModel from "../Models/user.models.mjs";
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
      }

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
      } catch (error) {
        throw new Error(error.message);
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
      }

      try {
        await UserModel.findByIdAndDelete(id);
        res.status(200).json({ Delete: "User Has Been Deleted" }).clearCookie("Access_Token");
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }
}
