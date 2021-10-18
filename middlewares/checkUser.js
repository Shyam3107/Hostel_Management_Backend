const Student = require("../models/student");
var jwt = require("jsonwebtoken");

module.exports.checkUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch (err) {
    console.log("error ", err);
    return res.status(401).json({ error: "UnAuthorized Request" });
  }
};
