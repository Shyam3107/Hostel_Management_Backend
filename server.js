const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const { checkUser } = require("./middlewares/checkUser");
const { login } = require("./controllers/login");
const attendanceRoute = require("./controllers/Attendance/route");
const studentRoute = require("./controllers/Student/route");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
dotenv.config();

const { PORT } = require("./config/constants");

app.listen(PORT, () => {
  console.log("Application Started in Port " + PORT);
});

const dbURI = process.env.MONGODB_URL;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("Database Connected");
  })
  .catch((err) => console.log(err));

app.get("/", async (req, res) => {
  return res.status(200).json({ data: "App started" });
});

app.get("/login", login);
app.use("/attendance", checkUser, attendanceRoute);
app.use("/student", checkUser, studentRoute);
