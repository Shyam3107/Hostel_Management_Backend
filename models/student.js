const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    rollNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    hostel: {
      type: String,
      enum: ["BH1", "BH2", "GH1"],
      required: true,
    },
    roomNo: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    programme: {
      type: String,
      enum: ["BTECH", "BE", "MTECH"],
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["STUDENT", "WARDEN", "ADMIN"],
      default: "STUDENT",
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
