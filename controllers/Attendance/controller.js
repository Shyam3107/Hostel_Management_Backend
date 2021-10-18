const Attendance = require("../../models/attendance");
const { convertCSVToJSON } = require("../../utils/utils");
const { handleError } = require("../../utils/utils");

module.exports.getAttendance = async (req, res) => {
  try {
    const user = req.user;
    let query = {};
    if (user.userType === "STUDENT") query = { rollNo: user.rollNo };
    const attendance = await Attendance.find(query);

    return res.status(200).json({ data: attendance });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports.addAttendance = async (req, res) => {
  try {
    const user = req.user;
    if (user.userType !== "ADMIN")
      return res.status(401).json({ error: "You do Not have Permission" });
    let data = await convertCSVToJSON("attendance");
    const insertData = await Attendance.insertMany(data);
    return res
      .status(200)
      .json({ data: insertData, entries: insertData.length });
  } catch (error) {
    return handleError(res, error);
  }
};
