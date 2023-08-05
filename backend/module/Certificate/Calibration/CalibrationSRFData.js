const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorizedSchema = new Schema({
  calibratedBy: {type:String, required: true},
  authorizedBy: {type:String, required: true}
})

const pressureUnitSchema = new Schema({
  pressureUnitData: {
    unitUnderCal: {type: String,required: true},
    standardReading: {type: String,required: true},
    error: {type: String,required: true},
    errorFS: {type: String,required: true}
  } 
})

const deviceDetailsSchema = new Schema({
  deviceData: {
    master_type: {type: String,required: true},
    stream: {type: String,required: true},
    instrument_name: {type: String,required: true},
    make_model: {type: String,required: true},
    serial_number: {type: String,required: true},
    id_number: {type: String,required: true},
    range: {type: String,required: true},
    least_count: {type: String,required: true},
    calibration_date: {type: String,required: true},
    due_date: {type: String,required: true},
    cf_number: {type: String,required: true},
    accuracy: {type: String,required: true},
    traceability: {type: String,required: true},
    }
});

const instrumentSchema = new Schema({
  instrument: {
    certificateNumber: { type: String, required: true }, // Add certificateNumber field
    instrument_name: { type: String, required: true },
    serial_number: { type: String, required: true },
    make_model: { type: String, required: true },
    id_number: { type: String, required: true },
    range: { type: String, required: true },
    fs: { type: String, required: true },
    accuracy: { type: String, required: true },
    least_count: { type: String, required: true },
    visual_inspection: { type: String, default: "N/A" },
    calibrate_at: { type: String, required: true },
    temperature: { type: String, default: "N/A" },
    relative_humidity: { type: String, default: "N/A" },
    cal_procedure: { type: String, default: "N/A" },
    supporting_standards: { type: String, default: "N/A" },
    zero_error: { type: String, default: "N/A" },
    calibration_date: { type: String, default: "N/A" },
    valid_date: { type: String, default: "N/A" },
    location: { type: String, default: "N/A" },
    deviceDetails: [deviceDetailsSchema],
    pressureUnitDetails: [pressureUnitSchema]
  },
});

const srfSchema = new Schema({
  issussDate: { type: String, required: true },
  srfNo: { type: String, required: true },
  client_name: { type: String, required: true },
  clientAddress: {
    address_line_1: { type: String, required: true },
    address_line_2: { type: String },
    city: { type: String, required: true },
    postal_code: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
  },
  instrumentDetails: [instrumentSchema],
  authorizedBy: [authorizedSchema],
  mainCertificateNumber: { type: String },
});

const calibrationSrfSchema = new Schema({
  // mainCertificateNumber: { type: String},
  srf: [srfSchema],
});

const CalibrationSRFData = mongoose.model(
  "CalibrationSRFData",
  calibrationSrfSchema
);
module.exports = CalibrationSRFData;
