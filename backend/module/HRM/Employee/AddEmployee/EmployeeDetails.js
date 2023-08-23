const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeRoleSchema = new Schema({
  calibrationEngineer: { type: String, default: "false" },
  branchHead: {type: String, default: "false"}
})

const prevOrganizationDetailsSchema = new mongoose.Schema({
      orgName: {type: String},
      designation: {type: String},
      annualCTC: {type: String},
      fromDate: {type: String},
      toDate: {type: String},
})

const educationDetailsSchema = new mongoose.Schema({
      educationType: {type: String, required: true},
      schoolName: {type: String, required: true},
      grade: {type: String, required: true},
      fromDate: {type: String, required: true},
      toDate: {type: String, required: true}
})

const emergencyDetailsSchema = new mongoose.Schema({
    firstPersonName: {type: String, required: true},
    firstPersonRelation: {type: String, required: true},
    firstPersonContact: {type: String, required: true},
    secPersonName: {type: String},
    secPersonRelation: {type: String},
    secPersonContact: {type: String},
})

const correspondenceAddressSchema = new mongoose.Schema({
  address_line_1: {type: String},
  address_line_2: {type: String},
  postal_code: {type: String},
  district: {type: String},
  state: {type: String},
});
const permanentAddressSchema = new mongoose.Schema({
  address_line_1: {type: String, required: true},
  address_line_2: {type: String},
  postal_code: {type: String, required: true},
  district: {type: String, required: true},
  state: {type: String, required: true},
});

const userSchema = new Schema({
    fName: {type: String, required: true},
    lName: {type: String},
    email: {type: String, required: true},
    fatherName: {type: String, required: true},
    motherName: { type: String},
    dob: {type: String, required: true},
    mobile_number: {type: String, required: true},
    gender: {type: String, required: true},
    department: {type: String, required: true},
    designation: {type: String, required: true},
    marital_status: {type: String},
    blood: {type: String},
    aadharNumber: {type: String, required: true},
    panNumber: {type: String, required: true},
    password: {type: String, required: true},
    user_pin: { type: String, default: "" },
    correspondenceAddresses: [correspondenceAddressSchema],
    permanentAddresses: [permanentAddressSchema],
    emergencyDetails: [emergencyDetailsSchema],
    educationDetails: [educationDetailsSchema],
    prevOrganizationDetails: [prevOrganizationDetailsSchema],
    employeeRole: [employeeRoleSchema]
});

 
const employeeDataSchema = new Schema({
  employeeData: [userSchema],
});

const EmployeeDetails = mongoose.model("EmployeeDetails", employeeDataSchema);
module.exports = EmployeeDetails;