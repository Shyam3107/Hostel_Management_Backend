const { Router } = require("express");
const {addStudent} = require("./controller");
const router = Router();

router.post("/addStudent", addStudent);

module.exports = router;
