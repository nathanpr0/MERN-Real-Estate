import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

// CONNTECTION TO DATABASEs
const app = express();
const mongodb = mongoose;

// API URL
const PORT = 3000;
const URL = process.env.URL;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).send({ ajg: "asu" });
});

const database = () => {
  try {
    mongoose.set("strictQuery", false);
    mongodb.connect(URL);

    console.log("Connect To Database");
    app.listen(PORT, () => {
      console.log(`Server Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Connection Failed," + error.message);
  }
};

database();
