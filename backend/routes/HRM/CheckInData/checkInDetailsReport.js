const express = require('express');
const EmployeeDetails = require('../../../module/HRM/Employee/AddEmployee/EmployeeDetails');
const CheckInDetails = require('../../../module/HRM/CheckInData/CheckInDetails');
const fetchEmployee = require('../../../middleware/fetchEmployee');
const { body, validationResult } = require("express-validator");
const router = express.Router()



// router.post('/addCheckIn', fetchEmployee, async (req, res) => {
//     try {
//         const { login, login_location, checkInType, login_address, site_name } = req.body;
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const employee = await EmployeeDetails.findById(req.employeeData.id);
//         if (!employee) {
//             return res.status(404).json({ error: 'Employee not found' });
//         }
//         const employeeDetailsData = employee.employeeData[0];

//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         // Check if the user has already checked in today
//         const existingCheckIn = await CheckInDetails.findOne({
//             'Employee.id': employee._id,
//             date: today
//         });

//         if (existingCheckIn && existingCheckIn.checkedInToday) {
//             return res.status(400).json({ error: 'You have already checked in today.' });
//         }

//         // Create the check-in record
//         const checkInDetails = new CheckInDetails({
//             Employee: {
//                 id: employee._id,
//                 fName: employeeDetailsData.fName,
//                 lName: employeeDetailsData.lName,
//                 mobile_number: employeeDetailsData.mobile_number,
//                 department: employeeDetailsData.department,
//             },
//             login: login,
//             checkInType: checkInType,
//             login_location: {
//                 latitude: login_location.latitude,
//                 longitude: login_location.longitude,
//                 time: new Date()
//             },
//             login_address: login_address,
//             site_name: site_name,
//             locationData: [
//                 {
//                     latitude: login_location.latitude,
//                     longitude: login_location.longitude,
//                     address: login_address,
//                     fetchTime: new Date()
//                 }
//             ]
//         });

//         console.log("CheckInDetails", checkInDetails);

//         checkInDetails.checkedInToday = true; // Mark user as checked in for the day

//         const checkIn = await checkInDetails.save();
//         res.status(201).json({ message: 'Check-in data added successfully' });
//         console.log(`New record created ${checkIn}`);
//     } catch (error) {
//         console.error('Error adding check-in data:', error);
//         res.status(500).json({ message: 'An error occurred' });
//     }
// });


router.post('/addCheckIn', fetchEmployee, async (req, res) => {
    try {
        const { login, login_location, checkInType,activity, login_address, site_name } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const employee = await EmployeeDetails.findById(req.employeeData.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        const employeeDetailsData = employee.employeeData[0];

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC

        // Find existing check-in for the day
        const existingCheckIn = await CheckInDetails.findOne({
            'Employee.id': employee._id,
            date: {
                $gte: today, // Greater than or equal to today's midnight
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Less than tomorrow's midnight
            }
        });
        
        console.log("Employee ID", employee._id)
        console.log("Date", today)
        console.log("Existing Checkin",existingCheckIn)
        

        if (existingCheckIn && existingCheckIn.checkedInToday) {
            return res.status(400).json({ error: 'You have already checked in today.' });
        }
        
        
        if (existingCheckIn) {
            existingCheckIn.checkedInToday = true;
            await existingCheckIn.save();
            return res.status(200).json({ message: 'Check-in data updated successfully' });
        }
        

        // Create a new check-in record
        const checkInDetails = new CheckInDetails({
            // ... other fields ...
            Employee: {
                id: employee._id,
                fName: employeeDetailsData.fName,
                lName: employeeDetailsData.lName,
                mobile_number: employeeDetailsData.mobile_number,
                department: employeeDetailsData.department,
            },
            login: login,
            checkInType: checkInType,
            activity: activity,
            login_location: {
                latitude: login_location.latitude,
                longitude: login_location.longitude,
                time: new Date()
            },
            login_address: login_address,
            site_name: site_name,
            locationData: [
                {
                    latitude: login_location.latitude,
                    longitude: login_location.longitude,
                    address: login_address,
                    fetchTime: new Date()
                }
            ],
            checkedInToday: true // Mark user as checked in for the day
        });

        const checkIn = await checkInDetails.save();
        res.status(201).json({ message: 'Check-in data added successfully' });
        // console.log(`New record created ${checkIn}`);
    } catch (error) {
        console.error('Error adding check-in data:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});






router.post('/addLocationData/:id', async (req, res) => {
    try {
        const checkInId = req.params.id;
        const { latitude, longitude, address } = req.body;

        const checkIn = await CheckInDetails.findById(checkInId);
        if (!checkIn) {
            return res.status(404).json({ error: 'Check-in data not found' });
        }

        // Check if logout details have already been submitted
        if (checkIn.logout_location && checkIn.logout_address) {
            return res.status(400).json({ error: 'You have already checked out. Please check in again.' });
        }

        // Check if login details haven't been submitted
        if (!checkIn.login_location || !checkIn.login_address) {
            return res.status(400).json({ error: 'Please check in first before adding location data.' });
        }

        // Add location data only if login details have been submitted and logout details haven't
        const newLocationData = {
            latitude: latitude,
            longitude: longitude,
            address: address,
            fetchTime: new Date()
        };

        checkIn.locationData.push(newLocationData);
        await checkIn.save();

        res.status(201).json({ message: 'Location data added successfully' });
    } catch (error) {
        console.error('Error adding location data:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});


router.post('/addLogoutDetails/:id', async (req, res) => {
    try {
        const checkInId = req.params.id;
        const { logout_location, logout_address } = req.body;

        const checkIn = await CheckInDetails.findById(checkInId);
        if (!checkIn) {
            return res.status(404).json({ error: 'Check-in data not found' });
        }

        // Check if logout details already exist
        if (checkIn.logout_location && checkIn.logout_address) {
            return res.status(400).json({ error: 'Logout details have already been submitted' });
        }

        checkIn.logout_location = {
            latitude: logout_location.latitude,
            longitude: logout_location.longitude,
            time: new Date()
        };
        checkIn.logout_address = logout_address;

        // Add logout details to locationData
        checkIn.locationData.push({
            latitude: logout_location.latitude,
            longitude: logout_location.longitude,
            address: logout_address,
            fetchTime: new Date()
        });

        await checkIn.save();

        res.status(201).json({ message: 'Logout details submitted successfully' });
    } catch (error) {
        console.error('Error submitting logout details:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});



// fetching employee details


// Define a route to fetch location details
router.get('/getLocationData/:id', async (req, res) => {
    try {
        const checkInId = req.params.id;

        const checkIn = await CheckInDetails.findById(checkInId);
        if (!checkIn) {
            return res.status(404).json({ error: 'Check-in data not found' });
        }

        res.status(200).json({ locationData: checkIn.locationData });
    } catch (error) {
        console.error('Error fetching location data:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});


// Route to fetch all check-in details
router.get("/checkin-details", async (req, res) => {
    try {
      const checkIns = await CheckInDetails.find();
      res.json(checkIns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch check-in details." });
    }
  });
  
  // Route to fetch a single check-in detail by ID
  router.get("/checkin-details/:id", async (req, res) => {
    try {
      const checkIn = await CheckInDetails.findById(req.params.id);
      if (!checkIn) {
        return res.status(404).json({ error: "Check-in detail not found." });
      }
      res.json(checkIn);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch check-in detail." });
    }
  });
  


//   router.post('/checkInEmployeeData', async (req, res) => {
//     try {
//       const userFilter = req.body; // Get the filter criteria from the request body
  
//       // Fetch data based on the user's filter criteria
//       const checkInData = await CheckInDetails.find(userFilter);
//       res.json(checkInData);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });


router.post('/checkInEmployeeData', async (req, res) => {
    try {
      const userFilter = req.body; // Get the filter criteria from the request body
  
      let filter = userFilter; // Use the provided filter criteria

      // If the user wants all departments for Calibration, remove the department criteria
      if (userFilter['Employee.department'] === 'All') {
        delete filter['Employee.department'];
      }
      if(userFilter['checkInType'] === 'All'){
        delete filter['checkInType']
      }
  
      // Fetch data based on the filter criteria
      const calibrationData = await CheckInDetails.find(filter);
      res.json(calibrationData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  




module.exports = router