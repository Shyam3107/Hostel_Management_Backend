const moment = require("moment");

const Leave = require("../../models/leave");
const {
  handleError,
  validateBody,
  errorValidation,
} = require("../../utils/utils");

module.exports.getLeave = async (req, res) => {
  try {
    const user = req.user;
    let query = {};
    if (user.userType === "STUDENT") query = { "student.rollNo": user.rollNo };
    else query = { leaveStatus: { $ne: "CANCELLED" } };
    const leave = await Leave.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      {
        $unwind: "$student",
      },
      {
        $match: query,
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
          "Roll No": "$student.rollNo",
          "From Date": "$fromDate",
          "To Date": "$toDate",
          Place: "$place",
          Purpose: "$purpose",
          Remarks: "$remarks",
          Type: "$leaveType",
          Status: "$leaveStatus",
        },
      },
    ]);

    return res.status(200).json({ data: leave });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports.addLeave = [
  validateBody(["fromDate", "toDate", "place", "purpose"]),
  async (req, res) => {
    try {
      const errors = errorValidation(req, res);
      const { fromDate, toDate } = req.body;
      if (errors) {
        return null;
      }
      const user = req.user;
      if (user.userType !== "STUDENT")
        return res.status(401).json({ error: "You do Not have Permission" });

      let fromMinDate = moment(fromDate)
        .hour(6)
        .minute(0)
        .second(0)
        .toISOString();
      let fromMaxDate = moment(fromDate)
        .hour(19)
        .minute(0)
        .second(0)
        .toISOString();
      let toMinDate = moment(toDate).hour(6).minute(0).second(0).toISOString();
      let toMaxDate = moment(toDate).hour(19).minute(0).second(0).toISOString();

      if (moment(toDate).isBefore(fromDate))
        return res
          .status(400)
          .json({ error: "To Date should be after From Date" });

      if (
        moment(fromDate).isBefore(fromMinDate) ||
        moment(fromDate).isAfter(fromMaxDate) ||
        moment(toDate).isAfter(toMaxDate) ||
        moment(toDate).isBefore(toMinDate)
      )
        return res
          .status(400)
          .json({ error: "Time should be between 6AM and 7PM" });

      const insertData = await Leave.create({
        ...req.body,
        studentId: user._id,
        leaveStatus: "PENDING",
      });
      return res
        .status(200)
        .json({ data: insertData, message: "Leave Applied Successfully" });
    } catch (error) {
      return handleError(res, error);
    }
  },
];

module.exports.editLeave = [
  validateBody(["leaveId", "leaveStatus"]),
  async (req, res) => {
    try {
      const errors = errorValidation(req, res);

      if (errors) {
        return null;
      }
      const user = req.user;
      const leaveStatus = req.body.leaveStatus;
      const leaveId = req.body.leaveId;
      if (user.userType === "ADMIN") throw "You do Not have Permission";
      let editData;
      let isWarden =
        user.userType === "WARDEN" &&
        (leaveStatus === "APPROVED" || leaveStatus === "REJECTED");

      let isStudent =
        user.userType === "STUDENT" && leaveStatus === "CANCELLED";

      if (isWarden || isStudent) {
        editData = await Leave.findByIdAndUpdate({ _id: leaveId }, req.body, {
          new: true,
        });
      } else {
        throw "Enter valid Status";
      }

      if (editData)
        return res
          .status(200)
          .json({ data: editData, message: `Leave Editted Successfully` });

      throw "Leave Not Found";
    } catch (error) {
      return handleError(res, error);
    }
  },
];
