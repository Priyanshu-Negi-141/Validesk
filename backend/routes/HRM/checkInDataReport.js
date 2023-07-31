const express = require('express')
const router = express.Router()
const moment = require('moment');
const { body, validationResult } = require("express-validator");
var fetchEmployee = require("../../middleware/fetchEmployee");
const EmployeeData = require('../../module/EmployeeData');
const CheckInData = require('../../module/HRM/CheckInData')


// router.post('/checkIn', fetchEmployee, async (req, res) => {
//     try {
//       const {date, checkInType,login, login_location, login_address, site_name } = req.body;
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
  
//       const employee = await EmployeeData.findById(req.employeeData.id);
//       if (!employee) {
//         return res.status(404).json({ error: 'Employee not found' });
//       }
  
//       const checkInData = new CheckInData({
//         Employee: {
//           id: employee._id,
//           fName: employee.fName,
//           lName: employee.lName,
//           department: employee.department,
//         },
//         date: date,
//         checkInType: checkInType,
//         login: login,
//         login_location: login_location,
//         login_address: login_address,
//         site_name: site_name,
//       });
  
//       const checkIn = await checkInData.save();

//       res.status(201).json({ message: 'Check-in data added successfully' });
//     } catch (error) {
//       console.error('Error adding check-in data:', error);
//       res.status(500).json({ message: 'An error occurred' });
//     }
//   });


router.post('/checkIn', fetchEmployee, async (req, res) => {
  try {
    const { login, loginLocation,checkInType, loginAddress, siteName } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const employee = await EmployeeData.findById(req.employeeData.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const today = moment().format('YYYY-MM-DD');

    const existingCheckIn = await CheckInData.findOne({
      'Employee.id': employee._id,
      logout: { $exists: false },
      date: today,
    });

    if (existingCheckIn) {
      return res.status(409).json({ error: 'You have already checked in today' });
    }

    const checkInData = new CheckInData({
      Employee: {
        id: employee._id,
        fName: employee.fName,
        lName: employee.lName,
        mobile_number: employee.mobile_number,
        department: employee.department,
      },
      date: today,
      login: login,
      checkInType: checkInType,
      login_location: loginLocation, // Ensure correct field name
      login_address: loginAddress, // Ensure correct field name
      site_name: siteName,
    });

    const checkIn = await checkInData.save();
    res.status(201).json({ message: 'Check-in data added successfully' });
    console.log(`New record created ${checkIn}`);
  } catch (error) {
    console.error('Error adding check-in data:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});


//   Check out
router.post('/checkOut', fetchEmployee, async (req, res) => {
  try {
    const { logout, logoutLocation, logoutAddress } = req.body;
    console.log('logoutLocation:', logoutLocation);
    console.log('logoutAddress:', logoutAddress);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const employee = await EmployeeData.findById(req.employeeData.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const today = moment().format('YYYY-MM-DD');

    const checkInData = await CheckInData.findOneAndUpdate(
      {
        'Employee.id': employee._id,
        logout: { $exists: false },
        date: today,
      },
      {
        $set: {
          logout: logout,
          logout_location: logoutLocation, // Ensure correct field name
          logout_address: logoutAddress, // Ensure correct field name
        },
      },
      { new: true }
    );

    if (!checkInData) {
      return res.status(404).json({ error: 'No check-in data found for today or already checked out' });
    }

    res.status(200).json({ message: 'Checkout data added successfully' });
    console.log(`Checkout data added ${checkInData}`);
  } catch (error) {
    console.error('Error adding checkout data:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});





//   Fetching data from here
// Geting data for Calibration Site Data 

router.get('/calibration-site', async (req, res) => {
    try {
      const filter = {
        "Employee.department": 'Calibration',
        checkInType: 'Site'
      };
  
      const calibrationData = await CheckInData.find(filter);
      res.json(calibrationData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Geting data for Calibration Office Data 

router.get('/calibration-office', async (req, res) => {
    try {
      const filter = {
        "Employee.department": 'Calibration',
          checkInType: 'Office'
      };

      const calibrationData = await CheckInData.find(filter);
      res.json(calibrationData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Getting data for HVAC Site Data 

router.get('/hvac-site', async (req, res) => {
    try {
      const filter = {
        "Employee.department": 'HVAC',
        checkInType: 'Site'
      };
  
      const calibrationData = await CheckInData.find(filter);
      res.json(calibrationData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Geting data for HVAC Office Data 

router.get('/hvac-office', async (req, res) => {
    try {
      const filter = {
        "Employee.department": 'HVAC',
        checkInType: 'Office'
      };
  
      const calibrationData = await CheckInData.find(filter);
      res.json(calibrationData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Geting data for Thermal Site Data 

router.get('/thermal-site', async (req, res) => {
    try {
      const filter = {
        "Employee.department": 'Thermal',
        checkInType: 'Site'
      };
  
      const calibrationData = await CheckInData.find(filter);
      res.json(calibrationData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Geting data for Thermal Office Data 

router.get('/thermal-office', async (req, res) => {
    try {
      const filter = {
        "Employee.department": 'Thermal',
        checkInType: 'Office'
      };
  
      const calibrationData = await CheckInData.find(filter);
      res.json(calibrationData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  // Geting data for PLC & CSV Site Data 

router.get('/plccsv-site', async (req, res) => {
    try {
      const filter = {
        "Employee.department": 'PLC-CSV',
        checkInType: 'Site'
      };
  
      const calibrationData = await CheckInData.find(filter);
      res.json(calibrationData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Geting data for PLC-CSV Office Data 

router.get('/plccsv-office', async (req, res) => {
    try {
      const filter = {
        "Employee.department": 'PLC-CSV',
        checkInType: 'Office'
      };
  
      const calibrationData = await CheckInData.find(filter);
      res.json(calibrationData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Geting data for CA Site Data 

  router.get('/ca-site', async (req, res) => {
    try {
      const filter = {
        "Employee.department": 'CA',
        checkInType: 'Site'
      };
  
      const calibrationData = await CheckInData.find(filter);
      res.json(calibrationData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Geting data for CA Office Data 

router.get('/ca-office', async (req, res) => {
    try {
      const filter = {
        "Employee.department": 'CA',
        checkInType: 'Office'
      };
  
      const calibrationData = await CheckInData.find(filter);
      res.json(calibrationData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  
  // Geting data for Steam Site Data 

  router.get('/steam-site', async (req, res) => {
    try {
      const filter = {
        "Employee.department": 'Steam',
        checkInType: 'Site'
      };
  
      const calibrationData = await CheckInData.find(filter);
      res.json(calibrationData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Geting data for Steam Office Data 

router.get('/steam-office', async (req, res) => {
    try {
      const filter = {
        "Employee.department": 'Steam',
        checkInType: 'Office'
      };
  
      const calibrationData = await CheckInData.find(filter);
      res.json(calibrationData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  
  



module.exports = router