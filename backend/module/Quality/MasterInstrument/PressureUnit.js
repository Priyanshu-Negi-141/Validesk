const mongoose = require("mongoose")
const Schema = mongoose.Schema

const pressureUnitSchema = new Schema({
    unit: {type: String, require: true},
    symbol: {type: String, require: true},
    value: {type: Number, require: true}
})

const PressureUnitData = mongoose.model("PressureUnitData", pressureUnitSchema);
module.exports=PressureUnitData;