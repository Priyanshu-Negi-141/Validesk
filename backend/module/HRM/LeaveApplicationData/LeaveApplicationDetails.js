const mongoose = require("mongoose")
const Schema = mongoose.Schema

const leaveApplicationSchema = new Schema({
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
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true,
        },
        mobile_number: {
            type: Number,
        },
        email: {
            type: String,
        },
    },
    reason: {type: [String]},
    startDate: {type: Date},
    endDate: {type: Date},
    numOfDays: {type: Number},
    comments: {type: String},
    hodApprovalStatus: {type: String, default: "Pending..."},
    adminApprovalStatus: {type: String, default: "Pending..."}
})

const LeaveApplicationDetails = mongoose.model("LeaveApplicationDetails",leaveApplicationSchema)
LeaveApplicationDetails.createIndexes()
module.exports = LeaveApplicationDetails;