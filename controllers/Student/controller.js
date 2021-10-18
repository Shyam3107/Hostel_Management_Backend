const md5 = require("md5");
const Student = require("../../models/student");
const { convertCSVToJSON } = require("../../utils/utils");
const { handleError } = require("../../utils/utils");

module.exports.addStudent = async (req, res) => {
  try {
    let user = req.user;
    if (user.userType !== "ADMIN")
      return res.status(401).json({ error: "You do Not have Permission" });
    let data = await convertCSVToJSON("students");

    data = data.map((val) => {
      let mssg = "";
      if (!val.rollNo) throw "Roll no is Required";
      if (!val.email) mssg = "Email";
      else if (!val.phone) mssg = "Phone";
      else if (!val.firstName) mssg = "First Name";
      else if (!val.phone) mssg = "Phone No";
      else if (!val.hostel) mssg = "Hostel";
      else if (!val.roomNo) mssg = "Room No.";
      else if (!val.programme) mssg = "Programme";
      else if (!val.department) mssg = "Department";

      if (mssg) throw `${mssg} is required for Roll ${val.rollNo}`;

      return {
        ...val,
        password: md5(val.phone),
        email: val.email.toLowerCase(),
        rollNo: val.rollNo.toUpperCase(),
        hostel: val.hostel.toUpperCase(),
        programme: val.programme.toUpperCase(),
        department: val.department.toUpperCase(),
      };
    });

    let insertData = [];
    for await (val of data) {
      let tempData = await Student.findOneAndUpdate(
        { rollNo: val.rollNo },
        val,
        { new: true, upsert: true }
      );
      insertData.push(tempData);
    }

    return res
      .status(200)
      .json({ data: insertData, entries: insertData.length });
  } catch (error) {
    return handleError(res, error);
  }
};
