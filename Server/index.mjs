import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

// IMPORT ROUTER
import userRouter from "./Routes/user.route.mjs";
import authRouter from "./Routes/auth.route.mjs";
import listingRouter from "./Routes/listing.route.mjs";

// API CONNECTIONS
const app = express();
const PORT = 3000;
const CONNECTION = process.env.CONNECTION;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// COOKIE PARSER FOR VERIFY USER ACCOUNT
app.use(cookieParser());

// API PERMISSION ACCESS
app.use(cors({ origin: [process.env.REACT_FRONT_END_URL], credentials: true }));

// ROUTES
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// ERROR MIDDLEWARE
app.use((err, req, res, next) => {
  const statusCode = err.statusCode ? err.statusCode : 500;
  res.status(statusCode).json({ Gagal_Diproses: err.message });
  next(err);
});

// RUNNING CONNECTION
const database = (url) => {
  try {
    mongoose.set("strictQuery", false);
    url(CONNECTION);

    console.log("Connect To Database");
    app.listen(PORT, () => {
      console.log(`Server Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Connection Failed," + error.message);
  }
};

database((stringConnect) => mongoose.connect(stringConnect));
