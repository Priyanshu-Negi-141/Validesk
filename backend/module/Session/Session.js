const mongoose = require("mongoose")
const Schema = mongoose.Schema

const sessionDataSchema = new Schema({
    session: { type: Number, required: true },
    startDate: {type: Date, required: true},
    endDate: {type: Date, require: true}
})

const SessionData = mongoose.model("SessionData",sessionDataSchema)
module.exports=SessionData;