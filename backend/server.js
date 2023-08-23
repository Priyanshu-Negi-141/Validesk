require('dotenv').config()
const express = require("express")
const connectToMongo = require("./db/db")
const cors = require("cors")


const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())


// Available Routes
app.use("/api/auth", require('./routes/loginEmployee'))
app.use("/api/auth", require('./routes/HRM/employeData'))
app.use("/api/employee", require('./routes/HRM/Employee/employeeData'))
app.use('/api/dayReport', require('./routes/HRM/dayReportData'))
// app.use('/api/checkIn', require('./routes/HRM/checkInDataReport'))
app.use('/api/checkInDetails', require('./routes/HRM/CheckInData/checkInDetailsReport'))
app.use('/api/sop', require('./routes/Quality/SOP/electroTechnical'))
app.use('/api/sop', require('./routes/Quality/SOP/mechenicalSOP'))
app.use('/api/sop', require('./routes/Quality/SOP/thermalSOP'))
app.use('/api/masterInstrument', require('./routes/Quality/MasterInstrument/calibrationMaster'))
app.use('/api/masterInstrument', require('./routes/Quality/MasterInstrument/hvacMaster'))
app.use('/api/masterInstrument', require('./routes/Quality/MasterInstrument/thermalMaster'))
app.use('/api/client', require('./routes/Client/clientData'))
app.use('/api/certificate', require('./routes/Certificate/Calibration/calCertificate'))
app.use('/api/unitParameter', require('./routes/Quality/UnitParameter/unitParameter'))


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