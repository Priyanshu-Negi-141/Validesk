const express = require('express');
const EmployeeDetails = require('../../../module/HRM/Employee/AddEmployee/EmployeeDetails');
const router = express.Router();


// Define a route to count employees in the "Calibration" department
router.get('/count-thermal-employees', async (req, res) => {
    try {
      const count = await EmployeeDetails.countDocuments({
        'employeeData.department': 'Thermal Validation',
      });
  
      res.json({ count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


module.exports = router;