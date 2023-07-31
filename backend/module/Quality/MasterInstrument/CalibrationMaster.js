const mongoose = require("mongoose")
const Schema = mongoose.Schema
const calibrationMasterSchema = new Schema({
    master_type:{
        type:String,
        required:true
    },
    stream: {
        type : String,
        required:true
    },
    instrument_name:{
        type:String,
        required:true
    },
    make_model:{
        type:String,
        required:true
    },
    serial_number:{
        type:String,
        required:true
    },
    id_number: {
        type:String,
        required:true
    },
    range: {
        type:String,
        required:true
    },
    least_count: {
        type:String,
        required:true
    },
    calibration_date: {
        type:String,
        required:true
    },
    due_date: {
        type:String,
        required:true
    },
    cf_number: {
        type:String,
        required:true
    },
    accuracy: {
        type:String,
        required:true
    },
    traceability: {
        type:String,
        required:true
    },
})

const CalibrationMasterData = mongoose.model("CalibrationMasterData",calibrationMasterSchema)
module.exports=CalibrationMasterData;