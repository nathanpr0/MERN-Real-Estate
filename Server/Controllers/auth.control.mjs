import UserModel from "../Models/user.models.mjs";
import asyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";

export default class AuthController {
  static create() {
    return asyncHandler(async (req, res) => {
      try {
        // HASHING PASSWORD
        const { username, email, password } = req.body;
        const hashedPassword = bcryptjs.hashSync(password, 10);

        // HANDLING ACCOUNT USER IF ALREADY CREATED
        const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
          if (existingUser.username === username) {
            res.status(409).json({ error: "Nama Pengguna sudah digunakan" });
          }
          if (existingUser.email === email) {
            res.status(409).json({ error: "Alamat Email sudah terdaftar" });
          }
          return;
        }

        // INSERT DATA TO DATABASE
        const response = await UserModel.create({ ...req.body, password: hashedPassword });

        // ACCOUNT IS CREATED
        res.status(201).json(response);
        console.log("User Account Created");
      } catch (error) {
        console.error("Failed to create user account");
        res.status(500);
        throw new Error("Server tidak mengenal izin data yang Masuk!");
      }
    });
  }
}
