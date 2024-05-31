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
        const token = jwt.sign({ id: response._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
        // DESTRUCTING PROPERTY PASSWORD UNTUK TIDAK MENGEKSPOS PASSWORD
        const { password: pass, ...data } = response._doc;
        // ACCOUNT IS CREATED
        res.cookie("Access_Token", token, { httpOnly: true }).status(201).json(data);

        return;
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
              expiresIn: "30d",
            });
            // DESTRUCTING PROPERTY PASSWORD UNTUK TIDAK MENGEKSPOS PASSWORD
            const { password: pass, ...data } = response._doc;

            // RESPONSE KE COOKIE
            res
              .cookie("Access_Token", token, {
                httpOnly: true,
              })
              .status(201)
              .json(data);

            return;
        }
      } catch (error) {
        console.error("Failed to SignIn user Account!");
        res.status(500);
        throw new Error(error.message);
      }
    });
  }

  static signOut() {
    return asyncHandler(async (req, res) => {
      try {
        res.clearCookie("Access_Token");
        res.status(200).json({ user: "User has been Logged Out!" });

        return;
      } catch (error) {
        throw new Error(error.message);
      }
    });
  }

  static google() {
    return asyncHandler(async (req, res) => {
      try {
        const { username, email } = req.body;
        const existingUser = await UserModel.findOne({
          email: email,
        });

        // JIKA USER PERNAH MENDAFTAR DENGAN AKUN GOOGLE SEBELUMNYA LANGSUNG DI BERIKAN TOKEN
        if (existingUser) {
          // CREATE TOKEN
          const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
          });

          // RESPONSE FROM SERVER TO CLIENT
          const { password: pass, ...data } = existingUser._doc;
          res
            .cookie("Access_Token", token, {
              httpOnly: true,
            })
            .status(201)
            .json(data);

          return;
        }
        // JIKA USER BELUM MENDAFTAR , LANGSUNG DI DAFTARKAN KE DATABASE DAN MEMBUAT TOKEN
        else {
          // RANDOM PASSWORD FOR GOOGLE ACCOUNT
          const generatedPassword =
            Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
          const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

          // SIGN UP USER ACCOUNT USING GOOGLE ACCOUNT TO DATABASE
          const response = await UserModel.create({
            username: username,
            email: email,
            password: hashedPassword,
            avatar: req.body.avatar,
          });

          // CREATE TOKEN
          const token = jwt.sign({ id: response._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
          });

          // RESPONSE FROM SERVER TO CLIENT
          const { password: pass, ...data } = response._doc;
          res.cookie("Access_Token", token, { httpOnly: true }).status(200).json(data);

          return;
        }
      } catch (error) {
        res.status(500);
        throw new Error(error.message);
      }
    });
  }
}
