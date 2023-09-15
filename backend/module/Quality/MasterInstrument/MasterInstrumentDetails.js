const mongoose = require("mongoose")
const Schema = mongoose.Schema


const masterInstrumentSchema = new Schema({
    sessionDetails: {
        sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'SessionData', required: true },
        sessionYear: { type: Number, required: true }
    },
    department: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'MasterDepartmentData', required: true }
    },
    stream: { type: String},
    instrument_name: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    serial_number: { type: String, required: true },
    id_number: { type: String, required: true },
    mode: { type: String, required: true },
    rangeData: [
      {
      minRange: { type: String, required: true },
      maxRange: { type: String, required: true },
      parameter: { type: String, required: true },
      }
    ],
    least_count: { type: String, required: true },
    calibration_date: { type: Date, required: true },
    due_date: { type: Date, required: true },
    cf_number: { type: String, required: true },
    accuracy: { type: String, required: true },
    traceability: { type: String, required: true },
    uncertainty: { type: String, required: true },
    uncertaintyTerm: { type: String, required: true },
    accuracyDetails: {
      absoluteValue: { type: String, required: true },
      perOfRange: { type: String, required: true },
      perofMessurement: { type: String, required: true },
    },
    calibrationRange: [
      {
        leastCount: { type: String, required: true },
        maxRange: { type: String, required: true },
        minRange: { type: String, required: true },
        unit: {type: String, required: true}
      },
    ],
    uncData: [
        {
          calibrationPoint: {type: String, required: true},
          error: {type: String, required: true},
          uncertainity: {type: String, required: true},
          unit: {type: String, required: true}
        }
    ],
    uniformity: [
      {
        setPoint: {type: String, required: true},
        uniformity: {type: String, required: true},
        stability: {type: String, required: true}
      }
    ]
})

const MasterInstrumentData = mongoose.model("MasterInstrumentData", masterInstrumentSchema);
module.exports=MasterInstrumentData;