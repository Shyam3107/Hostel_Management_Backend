const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    rollNo: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
