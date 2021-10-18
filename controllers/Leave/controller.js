const moment = require("moment");

const Leave = require("../../models/leave");
const {
  handleError,
  validateBody,
  errorValidation,
} = require("../../utils/utils");

module.exports.addLeave = [
  validateBody(["fromDate", "toDate", "place", "purpose"]),
  async (req, res) => {
    try {
      const errors = errorValidation(req, res);
      if (errors) {
        return null;
      }
      const user = req.user;
      if (user.userType !== "STUDENT")
        return res.status(401).json({ error: "You do Not have Permission" });

      let minDate = moment(fromDate).hour(6).minute(0).second(0).toISOString();
      let maxDate = moment(toDate).hour(19).minute(0).second(0).toISOString();

      if (
        // crosschek the Time
        moment(fromDate).isBefore(minDate) ||
        moment(fromDate).isAfter(maxDate) ||
        moment(toDate).isAfter(maxDate) ||
        moment(toDate).isBefore(minDate)
      )
        return res
          .status(400)
          .json({ error: "Time should be between 6AM and 7PM" });

      const insertData = await Leave.create({
        ...req.body,
        studentId: user._id,
        leaveStatus: "PENDING",
      });
      return res.status(200).json({ data: insertData });
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
        editData = await Leave.findByIdAndUpdate(
          { _id: leaveId },
          { leaveStatus },
          { new: true }
        );
      } else {
        throw "Enter valid Status";
      }

      if (editData) return res.status(200).json({ data: editData });

      throw "Leave Not Found";
    } catch (error) {
      return handleError(res, error);
    }
  },
];