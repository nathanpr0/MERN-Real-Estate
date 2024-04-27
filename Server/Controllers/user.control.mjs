import UserModel from "../Models/user.models.mjs";
import asyncHandler from "express-async-handler";

export default class UserController {
  static read() {
    return asyncHandler(async (req, res) => {
      try {
        const response = await UserModel.find();
        if (!response || response.length === 0) {
          res.status(404).json({ Account: "Tidak Terdaftar!" });
          return;
        }
        res.status(200).json(response);
        console.log("Fetching Your Account");
      } catch (error) {
        res.status(500);
        throw new Error("Server Gagal memproses Data");
      }
    });
  }
}
