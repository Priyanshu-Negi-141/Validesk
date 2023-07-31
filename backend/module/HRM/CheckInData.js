const mongoose = require("mongoose")
const Schema = mongoose.Schema
const checkInSchema = new Schema({
    Employee:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
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
    date: {
        type: String,
        required: true
    },
    checkInType:{
        type:String, 
        require: true
    },
    login: {
        type: String,
        required: true
    },
    login_location: {
        type: String,
        required: true
    },
    login_address: {
        type: String,
        required: true
    },
    logout: {
        type: String,
        required: false
    },
    logout_location: {
        type: String,
        required: false
    },
    logout_address: {
        type: String,
        required: false
    },
    site_name:{
        type:String,
        require: true
    }
})

const CheckInData = mongoose.model("CheckInData",checkInSchema)
module.exports=CheckInData;