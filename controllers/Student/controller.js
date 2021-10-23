const md5 = require("md5");
const Student = require("../../models/student");
const { convertCSVToJSON } = require("../../utils/utils");
const { handleError } = require("../../utils/utils");

module.exports.getStudents = async (req, res) => {
  try {
    const user = req.user;
    let query = {};
    if (user.userType === "STUDENT") query = { rollNo: user.rollNo };
    const students = await Student.aggregate([
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
            $concat: ["$firstName", " ", "$lastName"],
          },
          "Roll No": "$rollNo",
          Hostel: "$hostel",
          "Room No": "$roomNo",
          Year: "$year",
          Programme: "$programme",
          Department: "$department",
          "Phone No": "$phone",
          "E-Mail": "$email",
        },
      },
    ]);

    return res.status(200).json({ data: students });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports.addStudents = async (req, res) => {
  try {
    let user = req.user;
    if (user.userType !== "ADMIN")
      return res.status(401).json({ error: "You do Not have Permission" });
    let data = await convertCSVToJSON(req.file.path);

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
