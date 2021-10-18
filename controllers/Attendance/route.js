const { Router } = require("express");
const { getAttendance, addAttendance } = require("./controller");
const router = Router();

router.get("/getAttendance", getAttendance);
router.post("/addAttendance", addAttendance);

module.exports = router;
