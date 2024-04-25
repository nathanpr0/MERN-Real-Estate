import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();
const PORT = 3000;
const CONNECTION = process.env.CONNECTION;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).send({ ajg: "asu" });
});

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
