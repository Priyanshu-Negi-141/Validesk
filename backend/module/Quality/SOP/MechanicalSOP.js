const mongoose = require("mongoose")
const Schema = mongoose.Schema
const mechenicalSOPSchema = new Schema({
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

const MechenicalSOPData = mongoose.model("MechanicalSOPData",mechenicalSOPSchema)
module.exports=MechenicalSOPData;