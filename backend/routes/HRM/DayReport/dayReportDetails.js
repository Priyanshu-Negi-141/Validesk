const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchEmployee = require("../../../middleware/fetchEmployee");
const EmployeeDetails = require("../../../module/HRM/Employee/AddEmployee/EmployeeDetails");
const DayReportDetails = require("../../../module/HRM/DayReportData/DayReportDetails");


router.post(
    "/addDayReport",
    fetchEmployee,
    [
      body("SiteName", "Enter Site Name").isLength({ min: 2 }),
      body("Description", "Description atleast 3 character").isLength({ min: 3 }),
    ],
    async (req, res) => {
      try {
        const { Date, CheckInType, SiteName, Activity, Description } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const employee = await EmployeeDetails.findById(req.employeeData.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
          }
        const employeeData = employee.employeeData[0]; // Assuming there's only one entry in the array
        const dayReport = new DayReportDetails({
          Date: Date,
          CheckInType: CheckInType,
          Description: Description,
          SiteName: SiteName,
          Activity: Activity,
          Employee: {
            id: employee.id,
            fName: employeeData.fName,
            lName: employeeData.lName,
            department: employeeData.department,
          }
      });
      
        const saveDayReport = await dayReport.save();
        res.json(saveDayReport);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
      }
    }
  );


  router.post('/dayReportEmployeeData', async (req, res) => {
    try {
      const userFilter = req.body; // Get the filter criteria from the request body
  
      let filter = userFilter; // Use the provided filter criteria

      // If the user wants all departments for Calibration, remove the department criteria
      if (userFilter['Employee.department'] === 'All') {
        delete filter['Employee.department'];
      }
      if(userFilter['CheckInType'] === 'All'){
        delete filter['CheckInType']
      }
  
      // Fetch data based on the filter criteria
      const dayReportData = await DayReportDetails.find(filter);
      res.json(dayReportData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  
router.get("/individualEmployeeData", fetchEmployee, async (req, res) => {
    try {
      const employee = await EmployeeDetails.findById(req.employeeData.id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      const dayReportData = await DayReportDetails.find({
        "Employee.id": employee.id,
      });
      res.json(dayReportData);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occure");
    }
  });

module.exports = router