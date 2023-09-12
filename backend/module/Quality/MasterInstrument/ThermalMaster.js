const mongoose = require("mongoose")
const Schema = mongoose.Schema
const thermalMasterSchema = new Schema({
    master_type: {type:String,required:true},
    stream: {type:String,required:true},
    instrument_name: {type:String,required:true},
    make_model: {type:String,required:true},
    serial_number: {type:String,required:true},
    id_number: {type:String,required:true},
    mode: {type:String,required:true},
    range: {
        minRange: {type:String,required:true},
        maxRange: {type:String,required:true},
        parameterName: {type:String,required:true}
    },
    least_count: {type:String,required:true},
    calibration_date: {type:String,required:true},
    due_date: {type:String,required:true},
    cf_number: {type:String,required:true},
    accuracy: {type:String,required:true},
    traceability: {type:String,required:true},
    drift: {type:String, required: true},
    remarks: {type:String,required:true},
    stability: {type:String,required:true},
    uncertainty: {type:String,required:true},
    uncertaintyTerm: {type:String,required:true},
    uniformity: {type:String,required:true},
    accuracyDetails: {
        absoluteValue: {type: String},
        perOfRange: {type: String},
        perofMessurement: {type: String}
    },
    calibrationRange: [{
        leastCount: {type: String},
        maxRange: {type: String},
        minRange: {type: String}
    }]
})

const ThermalMasterData = mongoose.model("ThermalMasterData",thermalMasterSchema)
module.exports=ThermalMasterData;