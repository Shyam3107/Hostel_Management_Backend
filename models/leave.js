const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      default: "",
    },
    leaveType: {
      type: String,
      enum: ["OUTPASS", "NORMAL"],
      required: true,
      default: "NORMAL",
    },
    leaveStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
      required: true,
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;
