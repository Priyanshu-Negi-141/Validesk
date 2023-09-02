const mongoose = require("mongoose")
const Schema = mongoose.Schema

const streamDetailsSchema = new Schema({
    streamName: {type: [String]}
})


const masterDepartmentSchema = new Schema({
    departmentName: {type : String, requried: true},
    streamDetails: [streamDetailsSchema]
})



const MasterDepartmentData = mongoose.model("MasterDepartmentData",masterDepartmentSchema)
module.exports=MasterDepartmentData;