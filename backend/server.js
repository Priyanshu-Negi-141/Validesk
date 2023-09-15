require('dotenv').config()
const express = require("express")
const connectToMongo = require("./db/db")
const aws = require('aws-sdk');
const cors = require("cors");
const bodyParser = require('body-parser'); // Import body-parser



const app = express()
const PORT = process.env.PORT || 8001


app.use(cors())
app.use(express.json())

app.use(bodyParser.json()); // Use body-parser for JSON parsing
app.use(bodyParser.urlencoded({ extended: true })); // Enable URL-encoded data parsing


// Available Routes
app.use("/api/auth", require('./routes/loginEmployee'))
app.use("/api/auth", require('./routes/HRM/employeData'))
app.use("/api/homePage", require('./routes/HomePage/Calibration/calibration'))
app.use("/api/homePage", require('./routes/HomePage/HVAC/hvac'))
app.use("/api/homePage", require('./routes/HomePage/Thermal/thermal'))
app.use("/api/employee", require('./routes/HRM/Employee/employeeData'))
app.use('/api/dayReportDetails', require('./routes/HRM/DayReport/dayReportDetails'))
app.use('/api/leaveApplication', require('./routes/HRM/LeavApplication/leaveApplicationDetails'))
// app.use('/api/dayReport', require('./routes/HRM/dayReportData'))
// app.use('/api/checkIn', require('./routes/HRM/checkInDataReport'))
app.use('/api/checkInDetails', require('./routes/HRM/CheckInData/checkInDetailsReport'))
app.use('/api/profileImage', require('./routes/HRM/ProfileImage/predefineImage'))
app.use('/api/sop', require('./routes/Quality/SOP/electroTechnical'))
app.use('/api/sop', require('./routes/Quality/SOP/mechenicalSOP'))
app.use('/api/sop', require('./routes/Quality/SOP/thermalSOP'))
app.use('/api/masterInstrument', require('./routes/Quality/MasterInstrument/calibrationMaster'))
app.use('/api/masterInstrument', require('./routes/Quality/MasterInstrument/hvacMaster'))
app.use('/api/masterInstrument', require('./routes/Quality/MasterInstrument/thermalMaster'))
app.use('/api/masterInstrument', require('./routes/Quality/MasterInstrument/masterDepartment'))
app.use('/api/masterInstrument', require('./routes/Quality/MasterInstrument/masterInstrumentDetails'))
app.use('/api/rgp', require('./routes/RGP-DC/RGP/rgpDetails'))
app.use('/api/client', require('./routes/Client/clientData'))
app.use('/api/certificate', require('./routes/Certificate/Calibration/calCertificate'))
app.use('/api/unitParameter', require('./routes/Quality/UnitParameter/unitParameter'))
app.use('/api/session', require('./routes/Session/session'))
app.use('/api/upload', require('./routes/Upload/uploadApplication'))


app.get('/', (req,res) => {
    res.send("<h1>Welcome to the ValidexIndia</h1>")
})

// Port listening 
app.listen(PORT, (err) => {
    if (!err){
        console.log(`Server is running on port http://localhost:${PORT}`)
    }else{
        throw err;
    }
})