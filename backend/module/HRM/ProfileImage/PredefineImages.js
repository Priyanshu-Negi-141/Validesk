const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  Employee: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeDetails",
      required: true,
    },
    fName: { type: String, required: true },
    lName: { type: String },
    department: { type: String},
    designation: {type: String},
  },
  imageUrl: String
});

const PredefineImages = mongoose.model("PredefineImages", imageSchema);
module.exports = PredefineImages;
