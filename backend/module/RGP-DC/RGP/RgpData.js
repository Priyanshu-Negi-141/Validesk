const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rgpSchema = new Schema({
  clientName: { type: String, require: true },
  clientAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClientsData",
    required: true,
  },
  activity: { type: String, require: true },
  checkOutMaster: [
    {
      value: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MasterInstrumentData",
        required: true,
      },
      label: { type: String, require: true },
      id: { type: String, require: true },
      name: { type: String, require: true },
      status: { type: String, require: true },
    },
  ],
  preparedBy: { type: String, require: true },
  receivedBy: {
    receivedByID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeDetails",
      required: true,
    },
    receivedByName: { type: String, require: true },
  },
  date: { type: Date, default: Date.now(), required: true },
  rgpStatus : { type: String, require: true },
});

const RgpData = mongoose.model("RgpData", rgpSchema);
module.exports = RgpData;
