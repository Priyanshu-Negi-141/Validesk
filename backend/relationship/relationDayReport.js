const mongoose = require("mongoose")
const EmployeeData = require('../module/EmployeeData')
const DayReportData = require("../module/DayReport")

const saveDayReport = (employeeID, reportData) => {
    DayReportData.create(reportData)
    .then((createdReport) => {
        EmployeeData.findByIdAndUpdate(
            employeeID,
            {$push : {dayReports: createdReport._id}},
            {new: true}
        ).populate("dayReports") 
        .exec((err, employee) => {
            if(err) {
                console.error(err)
            } else {
                console.log(
                    `Employee Name: ${employee.fName} ${employee.lName}\nDay Report:`,
                    employee.dayReports
                )
            }
        })
    })
    .catch((error) => {
        console.error("Error saving day report:", error);
    })
}

module.exports = saveDayReport
