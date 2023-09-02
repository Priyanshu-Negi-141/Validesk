const express = require("express");
const EmployeeDetails = require("../../../module/HRM/Employee/AddEmployee/EmployeeDetails");
const CheckInDetails = require("../../../module/HRM/CheckInData/CheckInDetails");
const fetchEmployee = require("../../../middleware/fetchEmployee");
const { body, validationResult, check } = require("express-validator");
const router = express.Router();
const { putObject } = require("../../../s3-bucket/bucket");
const schedule = require("node-schedule");
const istTimeZone = "Asia/Kolkata";

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

router.get("/generate-upload-url", async (req, res) => {
  try {
    const fileName = `/uploads/employee/check-in/image-${Date.now()}.jpeg`;
    const contentType = "image/jpeg";

    const url = await putObject(fileName, contentType);

    const response = {
      status: true,
      message: "Upload URL generated successfully",
      data: [
        {
          img_path: fileName,
          url: url,
        },
      ],
    };

    res.json(response);
  } catch (error) {
    console.error("Error generating upload URL:", error);
    const response = {
      status: false,
      message: "Unable to generate upload URL",
      data: [],
    };
    res.status(500).json(response);
  }
});

router.post("/addCheckIn", fetchEmployee, async (req, res) => {
  try {
    const {
      login_location,
      checkInType,
      activity,
      login_address,
      site_name,
      image_path,
    } = req.body;

    const employee = await EmployeeDetails.findById(req.employeeData.id);
    if (!employee) {
      return res
        .status(404)
        .json({ status: false, message: "Employee not found", data: null });
    }
    const employeeDetailsData = employee.employeeData[0];

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC

    // Find existing check-in for the day
    const existingCheckIn = await CheckInDetails.findOne({
      "Employee.id": employee._id,
      date: {
        $gte: today, // Greater than or equal to today's midnight
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Less than tomorrow's midnight
      },
    });

    if (existingCheckIn && existingCheckIn.checkedInToday) {
      return res.status(200).json({
        status: false,
        message: "You have already checked in today.",
        data: null,
      });
    }

    if (existingCheckIn) {
      existingCheckIn.checkedInToday = true;
      const checkToday = await existingCheckIn.save();
      return res.status(200).json({
        status: true,
        message: "Check-in data updated successfully",
        data: checkToday._id,
      });
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
      checkInType: checkInType,
      activity: activity,
      login_location: {
        latitude: login_location.latitude,
        longitude: login_location.longitude,
        time: new Date(),
      },
      login_address: login_address,
      image_url: image_path,
      site_name: site_name,
      locationData: [
        {
          latitude: login_location.latitude,
          longitude: login_location.longitude,
          address: login_address,
          fetchTime: new Date(),
        },
      ],
      checkedInToday: true, // Mark user as checked in for the day
    });

    const checkIn = await checkInDetails.save();
    res.status(201).json({
      status: true,
      message: "Check-in data added successfully",
      data: checkIn._id,
    });
    // console.log(`New record created ${checkIn}`);
  } catch (error) {
    console.error("Error adding check-in data:", error);
    res
      .status(500)
      .json({ status: false, message: "An error occurred", data: error });
  }
});

router.post("/addLocationData/:id", async (req, res) => {
  try {
    const checkInId = req.params.id;
    const { latitude, longitude, address } = req.body;

    const checkIn = await CheckInDetails.findById(checkInId);
    if (!checkIn) {
      return res.status(404).json({
        status: false,
        message: "Check-in data not found",
        data: null,
      });
    }

    // Check if logout details have already been submitted
    if (checkIn.logout_location && checkIn.logout_address) {
      return res.status(200).json({
        status: false,
        message: "You have already checked out. Please check in again.",
        data: null,
      });
    }

    // Check if login details haven't been submitted
    if (!checkIn.login_location || !checkIn.login_address) {
      return res.status(400).json({
        status: false,
        message: "Please check in first before adding location data.",
        data: null,
      });
    }

    // Add location data only if login details have been submitted and logout details haven't
    const newLocationData = {
      latitude: latitude,
      longitude: longitude,
      address: address,
      fetchTime: new Date(),
    };

    checkIn.locationData.push(newLocationData);
    const locData = await checkIn.save();

    res.status(201).json({
      status: true,
      message: "Location data added successfully",
      data: locData,
    });
  } catch (error) {
    console.error("Error adding location data:", error);
    res
      .status(500)
      .json({ status: false, message: "An error occurred", data: error });
  }
});

// router.post("/addLocationData/:id", async (req, res) => {
//   try {
//     const checkInId = req.params.id;
//     const { latitude, longitude, address } = req.body;

//     const checkIn = await CheckInDetails.findById(checkInId);
//     if (!checkIn) {
//       return res.status(404).json({
//         status: false,
//         message: "Check-in data not found",
//         data: null,
//       });
//     }

//     // Check if logout details have already been submitted
//     if (checkIn.logout_location && checkIn.logout_address) {
//       return res.status(200).json({
//         status: false,
//         message: "You have already checked out. Please check in again.",
//         data: null,
//       });
//     }

//     // Check if login details haven't been submitted
//     if (!checkIn.login_location || !checkIn.login_address) {
//       return res.status(400).json({
//         status: false,
//         message: "Please check in first before adding location data.",
//         data: null,
//       });
//     }

//     // Add location data only if login details have been submitted and logout details haven't
//     const newLocationData = {
//       latitude: latitude,
//       longitude: longitude,
//       address: address,
//       fetchTime: new Date(),
//     };

//     checkIn.locationData.push(newLocationData);

//     // Check if logout details are available, if so, add them to location data
//     if (checkIn.logout_location && checkIn.logout_address) {
//       const logoutLocationData = {
//         latitude: checkIn.logout_location.latitude,
//         longitude: checkIn.logout_location.longitude,
//         address: checkIn.logout_address,
//         fetchTime: new Date(),
//       };
//       checkIn.locationData.push(logoutLocationData);
//     }

//     const locData = await checkIn.save();

//     res.status(201).json({
//       status: true,
//       message: "Location data added successfully",
//       data: locData,
//     });
//   } catch (error) {
//     console.error("Error adding location data:", error);
//     res.status(500).json({ status: false, message: "An error occurred", data: error });
//   }
// });

// router.post('/addLogoutDetails/:id', async (req, res) => {
//     try {
//         const checkInId = req.params.id;
//         const { logout_location, logout_address } = req.body;

//         const checkIn = await CheckInDetails.findById(checkInId);
//         if (!checkIn) {
//             return res.status(404).json({status: false, message: 'Check-in data not found', data: null });
//         }

//         // Check if logout details already exist
//         if (checkIn.logout_location && checkIn.logout_address) {
//             return res.status(200).json({ status: false, message: 'Logout details have already been submitted', data: null });
//         }

//         checkIn.logout_location = {
//             latitude: logout_location.latitude,
//             longitude: logout_location.longitude,
//             time: new Date()
//         };
//         checkIn.logout_address = logout_address;

//         // Add logout details to locationData
//         checkIn.locationData.push({
//             latitude: logout_location.latitude,
//             longitude: logout_location.longitude,
//             address: logout_address,
//             fetchTime: new Date()
//         });

//         const newCheckInData = await checkIn.save();

//         res.status(201).json({ status: true, message: 'Logout details submitted successfully',  data: newCheckInData});
//     } catch (error) {
//         console.error('Error submitting logout details:', error);
//         res.status(500).json({status: false, message: 'An error occurred', data: error });
//     }
// });

// Replace with the appropriate time zone identifier

// Function to perform the auto-checkout for all eligible employees
async function performAutoCheckout() {
  try {
    // Get the current date and time in IST
    const now = new Date().toLocaleString("en-US", { timeZone: istTimeZone });
    const currentTime = new Date(now);

    // Find employees who haven't checked out for today
    const today = new Date(currentTime);
    today.setHours(0, 0, 0, 0); // Set time to midnight in IST
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Tomorrow at midnight in IST

    const employeesToAutoCheckout = await CheckInDetails.find({
      date: {
        $gte: today,
        $lt: tomorrow,
      },
      checkedInToday: true,
      logout_location: { $exists: false }, // Employees who haven't checked out
    });

    // Fetch the last logout location and time for each eligible employee
    for (const employee of employeesToAutoCheckout) {
      const lastLogout = await CheckInDetails.findOne({
        "Employee.id": employee.Employee.id,
        logout_location: { $exists: true },
      }).sort({ date: -1 });

      // Set the checkout time to 11:00 PM IST
      const checkoutTime = new Date(today);
      checkoutTime.setHours(23, 55, 0, 0); // 11:00 PM IST

      // Set the logout location and time for the employee
      if (lastLogout) {
        employee.logout_location = {
          latitude: lastLogout.logout_location.latitude,
          longitude: lastLogout.logout_location.longitude,
          time: lastLogout.logout_location.time,
        };
      } else {
        // If no previous logout location exists, you can set default values or handle it accordingly
        employee.login_location = {
          latitude: login_location.latitude, // Set appropriate coordinates
          longitude: login_location.longitude,
          time: checkoutTime,
        };
      }

      employee.logout_address = "Auto-checkout at 11:55 PM";

      // Save the changes
      await employee.save();
    }

    console.log(
      `Auto-checked out ${employeesToAutoCheckout.length} employees.`
    );
  } catch (error) {
    console.error("Error in auto-checkout job:", error);
  }
}

// Schedule the job to run every day at 11:00 PM IST
const checkoutJob = schedule.scheduleJob("55 23 * * *", () => {
  // Call the function to perform auto-checkout for all eligible employees
  performAutoCheckout();
});

// Handle errors in the job
checkoutJob.on("error", (err) => {
  console.error("Error scheduling auto-checkout job:", err);
});

router.post("/addLogoutDetails", fetchEmployee, async (req, res) => {
  try {
    const { employeeData } = req;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC

    // Find the check-in record for the employee for today
    const existingCheckIn = await CheckInDetails.findOne({
      "Employee.id": employeeData.id,
      date: {
        $gte: today, // Greater than or equal to today's midnight
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Less than tomorrow's midnight
      },
    });

    if (!existingCheckIn || !existingCheckIn.checkedInToday) {
      return res.status(400).json({
        status: false,
        message: "You have not checked in today or already checked out.",
        data: null,
      });
    }

    // Check if logout details have already been submitted
    if (existingCheckIn.logout_location && existingCheckIn.logout_address) {
      return res.status(200).json({
        status: false,
        message:
          "You have already checked out. Please check in again to check out.",
        data: null,
      });
    }

    // Update the existing check-in record with checkout details
    const { logout_location, logout_address } = req.body;
    existingCheckIn.logout_location = {
      latitude: logout_location.latitude,
      longitude: logout_location.longitude,
      time: new Date(),
    };
    existingCheckIn.logout_address = logout_address;

    // Add logout details to locationData
    existingCheckIn.locationData.push({
      latitude: logout_location.latitude,
      longitude: logout_location.longitude,
      address: logout_address,
      fetchTime: new Date(),
    });

    const checkOut = await existingCheckIn.save();

    res.status(200).json({
      status: true,
      message: "Check-out data added successfully",
      data: checkOut._id,
    });
  } catch (error) {
    console.error("Error adding check-out data:", error);
    res
      .status(500)
      .json({ status: false, message: "An error occurred", data: error });
  }
});

// fetching employee details

// Define a route to fetch location details
router.get("/getLocationData/:id", async (req, res) => {
  try {
    const checkInId = req.params.id;

    const checkIn = await CheckInDetails.findById(checkInId);
    if (!checkIn) {
      return res.status(404).json({
        status: false,
        message: "Check-in data not found",
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Check-In data found Successfully",
      data: checkIn.locationData,
    });
  } catch (error) {
    console.error("Error fetching location data:", error);
    res
      .status(500)
      .json({ status: false, message: "An error occurred", data: error });
  }
});

// Route to fetch all check-in details
router.get("/checkin-details", async (req, res) => {
  try {
    const checkIns = await CheckInDetails.find();
    res.json({ status: true, message: "User CheckIn Details", data: checkIns });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch check-in details.",
      data: error,
    });
  }
});

// Route to fetch a single check-in detail by ID
router.get("/checkin-details/:id", async (req, res) => {
  try {
    const checkIn = await CheckInDetails.findById(req.params.id);
    if (!checkIn) {
      return res.status(404).json({
        status: false,
        message: "Check-in detail not found.",
        data: null,
      });
    }
    res.json({
      status: true,
      message: "Check In Details fetched Successfully",
      data: checkIn,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch check-in detail.",
      data: error,
    });
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

router.post("/checkInEmployeeData", async (req, res) => {
  try {
    const userFilter = req.body; // Get the filter criteria from the request body

    let filter = userFilter; // Use the provided filter criteria

    // If the user wants all departments for Calibration, remove the department criteria
    if (userFilter["Employee.department"] === "All") {
      delete filter["Employee.department"];
    }
    if (userFilter["checkInType"] === "All") {
      delete filter["checkInType"];
    }

    // Fetch data based on the filter criteria
    const calibrationData = await CheckInDetails.find(filter);
    res.json({
      status: true,
      message: "Employee Checkin Data fetched Successfully",
      data: calibrationData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: false, message: "Internal Server Error", data: error });
  }
});

module.exports = router;
