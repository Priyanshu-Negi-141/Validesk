const mongoose = require("mongoose")
const Schema = mongoose.Schema
const thermalSOPSchema = new Schema({
    sop_name: {
        type: String,
        required: true
    },
    sop_number: {
        type: String,
        required: true
    },
    is:{
        type: String,
        required: true
    },
    amendment_no :{
        type: String,
        required: true
    },
    amendment_date: {
        type: String,
        required: true
    }
})

const ThermalSOPData = mongoose.model("ThermalSOPData",thermalSOPSchema)
module.exports=ThermalSOPData;