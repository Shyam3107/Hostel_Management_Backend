const { Router } = require("express");
const { addLeave, editLeave } = require("./controller");
const router = Router();

router.post("/addLeave", addLeave);
router.put("/editLeave", editLeave);

module.exports = router;
