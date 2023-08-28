const mongoose = require("mongoose")
const Schema = mongoose.Schema
const dayReportSchema = new Schema({
    Employee:{
        id: {type: mongoose.Schema.Types.ObjectId,
            ref:'EmployeeDetails',
            required: true
        },
        fName: {
            type: String,
            required: true,
        },
        lName: {
            type: String
        },
        department: {
            type: String,
            required: true,
        },
    },  
    Date: {
        type: String,
        required: true
    },
    CheckInType: {
        type: String,
        required: true
    },
    SiteName: {
        type: String,
        required: true
    },
    Activity: {
        type:String,
        required: true
    },
    Description:{
        type:String,
        default:"N/A"
    }
})

const DayReportDetails = mongoose.model("DayReportDetails",dayReportSchema)
DayReportDetails.createIndexes()
module.exports=DayReportDetails;