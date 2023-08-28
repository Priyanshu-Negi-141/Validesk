const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  latitude: {type: Number},
  longitude: {type: Number},
  address: {type: String, require: true},
  fetchTime: {type: Date, default: Date.now, required: true,},
});

const checkInSchema = new Schema({
  Employee: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeDetails",
      required: true,
    },
    fName: { type: String, required: true },
    lName: { type: String },
    department: { type: String, required: true },
    mobile_number: {type: String,required: true,},
  },
  date: {type: Date,default: Date.now,required: true,},
  activity: {type: String,require: true,},
  checkInType: {type: String,require: true,},
  site_name: {type: String,require: true,},
  login_location: {
    type: {
        latitude: Number,
        longitude: Number,
        time: Date
    },
    required: true
},
  login_address: {type: String,required: true,},
  logout_location: {
    type: {
        latitude: Number,
        longitude: Number,
        time: Date
    },
    required: false
},
  logout_address: {type: String,required: false,},
  checkedInToday: {type: Boolean,default: false,},
  locationData: [locationSchema]
});

const CheckInDetails = mongoose.model("CheckInDetails", checkInSchema);
module.exports = CheckInDetails;
