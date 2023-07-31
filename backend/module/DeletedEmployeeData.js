const mongoose = require("mongoose");
const Schema = mongoose.Schema
const deletedEmployeeDataSchema = new Schema({
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    email: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, default: "N/A" },
    dob: { type: String, required: true },
    mobile_number: { type: String, required: true },
    gender: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    marital_status: { type: String, required: true },
    blood: { type: String, required: true },
    password: { type: String, required: true },
});

const deletedEmployeeSchema = new Schema({
    employeeDeleted: [deletedEmployeeDataSchema],
  });

const DeletedEmployeeData = mongoose.model(
  "DeletedEmployeeData",
  deletedEmployeeSchema
);
DeletedEmployeeData.createIndexes()
module.exports = DeletedEmployeeData;
