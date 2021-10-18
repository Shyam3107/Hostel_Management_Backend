const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    rollNo: {
      type: String,
    },
    time: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
