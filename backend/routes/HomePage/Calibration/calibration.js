const express = require('express');
const CalibrationSRFData = require('../../../module/Certificate/Calibration/CalibrationSRFData');
const EmployeeDetails = require('../../../module/HRM/Employee/AddEmployee/EmployeeDetails');
const router = express.Router();


router.get("/counter", async (req, res) => {
    try {
      const aggregateResult = await CalibrationSRFData.aggregate([
        {
          $match: {
            "srf.mainCertificateNumber": { $exists: true, $ne: "" }
          }
        },
        {
          $group: {
            _id: null,
            maxCertificateNumber: { $max: "$srf.mainCertificateNumber" }
          }
        }
      ]);
  
      if (aggregateResult.length === 0) {
        return res.status(404).json({ error: "No data found" });
      }
  
      const { maxCertificateNumber } = aggregateResult[0];
  
      return res.status(200).json({ maxCertificateNumber });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });



// Define a route to count employees in the "Calibration" department
router.get('/count-calibration-employees', async (req, res) => {
    try {
      const count = await EmployeeDetails.countDocuments({
        'employeeData.department': 'Calibration',
      });
  
      res.json({ count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  module.exports = router;