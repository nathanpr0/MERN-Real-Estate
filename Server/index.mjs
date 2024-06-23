import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

// IMPORT ROUTER
import userRouter from "./Routes/user.route.mjs";
import authRouter from "./Routes/auth.route.mjs";
import listingRouter from "./Routes/listing.route.mjs";

// IMPORT CUSTOM ERROR MIDDLEWARE
import customErrorMiddleWare from "./utils/error.middleware.mjs";

// API CONNECTIONS
const app = express();
const _dirname = path.resolve();

// ENV KEYS
const PORT = process.env.PORT;
const CONNECTION = process.env.CONNECTION;

// MIDDLEWARE PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// COOKIE PARSER FOR VERIFY USER ACCOUNT
app.use(cookieParser());

// API PERMISSION ACCESS
app.use(
  cors({
    origin: [process.env.REACT_FRONT_END_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ROUTES
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// CREATE DIST FOLDER IN CLIENT SIDE TO DEPLOY THE PROJECT
app.use(express.static(path.join(_dirname, "/Client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(_dirname, "Client", "dist", "index.html"));
});

// ERROR MIDDLEWARE
app.use(customErrorMiddleWare);

// RUNNING SERVER
/**
 *
 * @param {callback_MongoDB_Connections} url - MongoDB Connection String
 */
const database = (url) => {
  try {
    // MONGODB CONNECT
    mongoose.set("strictQuery", false);
    url(CONNECTION);

    // EXPRESS RUNNING
    app.listen(PORT, () => {
      console.log(`Server Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Connection Failed," + error.message);
  }
};

database((stringConnect) => {
  mongoose
    .connect(stringConnect)
    .then(() => console.log("Connect To Database"))
    .catch((err) => console.log(err));
});
