const { Router } = require("express");
const { addLeave, editLeave, getLeave } = require("./controller");
const router = Router();

router.get("/getLeave", getLeave);
router.post("/addLeave", addLeave);
router.put("/editLeave", editLeave);

module.exports = router;
