const Attendance = require("../../models/attendance");
const { convertCSVToJSON } = require("../../utils/utils");
const { handleError } = require("../../utils/utils");
const fs = require("fs");
const path = require("path");

module.exports.getAttendance = async (req, res) => {
  try {
    const user = req.user;
    let query = {};
    if (user.userType === "STUDENT") query = { rollNo: user.rollNo };
    const attendance = await Attendance.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "students",
          localField: "rollNo",
          foreignField: "rollNo",
          as: "student",
        },
      },
      {
        $unwind: "$student",
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $project: {
          Name: {
            $concat: ["$student.firstName", " ", "$student.lastName"],
          },
          Time: "$time",
          "Roll No": "$rollNo",
        },
      },
    ]);

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

    let data = await convertCSVToJSON(req.file.path);

    const insertData = await Attendance.insertMany(data);
    fs.unlinkSync(path.join(req.file.path));
    return res.status(200).json({
      data: insertData,
      entries: insertData.length,
      message: `Successfully Inserted ${insertData.length} entries`,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
