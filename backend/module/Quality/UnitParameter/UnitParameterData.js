const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const unitParameterSchema = new Schema({
  parameter_name: {
    type: String,
    required: true,
  },
  parameter_desc: {
    type: String,
    required: true,
  },
  parameter_symbol: {
    type: String,
    required: true,
  },
});

const unitParameter = new Schema({
  unitParameterDetails: [unitParameterSchema],
});

const UnitParameterData = mongoose.model("UnitParameterData", unitParameter);
module.exports = UnitParameterData