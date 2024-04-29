import UserModel from "../Models/user.models.mjs";
import asyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export default class AuthController {
  static signUp() {
    return asyncHandler(async (req, res) => {
      try {
        // HASHING PASSWORD
        const { username, email, password } = req.body;
        const hashedPassword = bcryptjs.hashSync(password, 10);

        // HANDLING ACCOUNT USER IF ALREADY CREATED
        const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
          if (existingUser.username === username) {
            return res.status(409).json({ error: "Nama Pengguna sudah digunakan" });
          }
          if (existingUser.email === email) {
            return res.status(409).json({ error: "Alamat Email sudah terdaftar" });
          }
          return;
        }

        // INSERT DATA TO DATABASE
        const response = await UserModel.create({ ...req.body, password: hashedPassword });

        // CREATING COOKIE TOKEN
        const token = jwt.sign({ id: response._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        // DESTRUCTING PROPERTY PASSWORD UNTUK TIDAK MENGEKSPOS PASSWORD
        const { password: pass, ...data } = response._doc;

        // ACCOUNT IS CREATED
        res
          .cookie("Access Token", token, process.env.JWT_SECRET, { httpOnly: true })
          .status(201)
          .json(data);
        console.log("User Account Created");
      } catch (error) {
        console.error("Failed to create user account");
        res.status(500);
        throw new Error("Server tidak mengenal izin data yang Masuk!");
      }
    });
  }

  static signIn() {
    return asyncHandler(async (req, res) => {
      try {
        const { email, password } = req.body;
        const response = await UserModel.findOne({ email });

        if (!response) {
          res.status(404).json({
            error: "Data Akun tidak ditemukan!",
            status: 404,
            email: `${email} NOT FOUND!`,
          });
          return;
        }

        // PASSWORD VALIDATION
        const validPassword = bcryptjs.compareSync(password, response.password);
        switch (false) {
          case validPassword:
            res.status(401).json({ error: "Password Anda tidak sesuai dengan email!" });
            return;
          default:
            // CREATING COOKIE TOKEN
            const token = jwt.sign({ id: response._id }, process.env.JWT_SECRET, {
              expiresIn: "1h",
            });
            // DESTRUCTING PROPERTY PASSWORD UNTUK TIDAK MENGEKSPOS PASSWORD
            const { password: pass, ...data } = response._doc;

            // RESPONSE KE COOKIE
            res.cookie("Access Token", token, { httpOnly: true }).status(200).json(data);
            console.log(`Berhasil Login`);
        }
      } catch (error) {
        console.error("Failed to SignIn user Account!");
        res.status(500);
        throw new Error(error.message);
      }
    });
  }
}
