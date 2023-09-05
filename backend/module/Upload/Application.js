const mongoose = require("mongoose")
const Schema = mongoose.Schema

const applicationSchema = new Schema({
    applicationPath: {type: String},
    date: {type: Date,default: Date.now()}
})
const ApplicationData = mongoose.model("ApplicationData",applicationSchema)
module.exports = ApplicationData