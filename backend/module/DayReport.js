const mongoose = require("mongoose")
const Schema = mongoose.Schema
const dayReportSchema = new Schema({
    Employee:{
        id: {type: mongoose.Schema.Types.ObjectId,
            ref:'EmployeeData',
            required: true
        },
        fName: {
            type: String,
            required: true,
        },
        lName: {
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true,
        }
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

const DayReportData = mongoose.model("DayReportData",dayReportSchema)
DayReportData.createIndexes()
module.exports=DayReportData;