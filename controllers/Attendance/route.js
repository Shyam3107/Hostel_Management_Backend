const { Router } = require("express");
const { getAttendance, addAttendance } = require("./controller");
const router = Router();
const uploadFile = require("../../utils/uploadFile");

router.get("/getAttendance", getAttendance);
router.post("/addAttendance", uploadFile.single("file"), addAttendance);

module.exports = router;
