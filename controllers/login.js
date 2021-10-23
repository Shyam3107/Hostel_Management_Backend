const jwt = require("jsonwebtoken");
const md5 = require("md5");
const dotenv = require("dotenv");
const Student = require("../models/student");
const { handleError } = require("../utils/utils");
dotenv.config();

const warden = {
  userName: process.env.WARDEN_EMAIL,
  password: md5(process.env.WARDEN_PASSWORD),
  userType: "WARDEN",
};

const admin = {
  userName: process.env.ADMIN_EMAIL,
  password: md5(process.env.ADMIN_PASSWORD),
  userType: "ADMIN",
};

module.exports.login = async (req, res) => {
  try {
    const userName = req.query.userName;
    const password = req.query.password;
    const encryptPassword = md5(password);

    let user;

    if (userName == warden.userName) {
      if (encryptPassword === warden.password) user = warden;
    } else if (userName === admin.userName) {
      if (encryptPassword === admin.password) user = admin;
    } else {
      user = await Student.findOne({
        email: userName,
        password: encryptPassword,
      });
      user = JSON.stringify(user);
      user = JSON.parse(user);
    }

    if (!user)
      return res.status(400).json({ error: "User or Password is Incorrect" });

    const token = jwt.sign(user, process.env.JWT_SECRET_KEY, {
      //expiresIn: "24h",
    });

    return res.status(200).json({ user, token });
  } catch (error) {
    return handleError(res, error);
  }
};
