const { Router } = require("express");
const { addStudents, getStudents } = require("./controller");
const router = Router();
const uploadFile = require("../../utils/uploadFile");

router.get("/getStudents", getStudents);
router.post("/addStudents", uploadFile.single("file"), addStudents);

module.exports = router;
