import Student from "../models/students.models.js";
import Users from "../models/user.model.js";

export const getStudents = async (req, res) => {
  try {
    // const filteredStudent = await Student.find()
    //   .where("isActive")
    //   .equals(true)
    //   .where("age")
    //   .gte(12);

    let query = JSON.stringify(req.query);
    query = query.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    let queryObj = JSON.parse(query);

    const excluteQuery = ["sort", "limit", "page", "fields", "search"];

    excluteQuery.forEach((key) => {
      delete queryObj[key];
    });

    if (req.query.search) {
      queryObj.fullName = new RegExp(req.query.search, "i");
    }

    const getQuery = Student.find(queryObj);

    if (req.query.sort) {
      getQuery.sort(req.query.sort);
    }

    if (req.query.fields) {
      getQuery.select(req.query.fields);
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = limit * (page - 1);

    getQuery.skip(skip).limit(limit);

    const students = await getQuery;

    res.json({ status: "success", results: students.length, data: students });
  } catch (err) {
    res.status(400).json({ status: "error", data: err });
  }
};

export const addStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);

    await Users.findByIdAndUpdate(req.body.userId, {
      $set: { studentId: student._id },
    });

    res.json({ status: "success", data: student });
  } catch (err) {
    res.status(400).json({ status: "error", data: err });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    res.json({ status: "success", data: student });
  } catch (err) {
    res.status(400).json({ status: "error", data: err });
  }
};
