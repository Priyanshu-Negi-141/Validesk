const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const moment = require("moment");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "ValidexIndia";
var fetchEmployee = require("../../../middleware/fetchEmployee");
const EmployeeDetails = require("../../../module/HRM/Employee/AddEmployee/EmployeeDetails");
const DeletedEmployeeData = require("../../../module/DeletedEmployeeData");

// router.post('/addEmployeeData',[
//     body('employeeData.fName', 'Enter at least 3 characters for first name').isLength({ min: 3 }),
//     body('employeeData.email', 'Enter a valid email').isEmail(),
//     body('employeeData.password', "Password must have at least 5 characters").isLength({ min: 5 }),
// ], async (req, res) => {
//     try {
//         console.log("Request Body:", req.body); // Add this line for debugging
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             console.log("Validation Errors:", errors.array()); // Add this line for debugging
//             return res.status(400).json({
//                 errors: errors.array()
//             });
//         }
//         // check whether the user with this email already exists
//         let employeeData = await EmployeeDetails.findOne({ "employeeData.employeePersonalData[0].email": req.body.employeeData.email });
//         if (employeeData) {
//             return res.status(400).json({ errors: "Sorry, a user with this email already exists" });
//         }
//         console.log(employeeData.fname)
//         const salt = await bcrypt.genSalt(10);
//         const secPass = await bcrypt.hash(req.body.employeeData.password, salt);
//         const dob = req.body.employeeData.dob;
//         const dobDate = moment(dob, 'DD-MM-YYYY').format('DD-MM-YYYY');
//         employeeData = [{
//             fName: req.body.employeeData.fName,
//             lName: req.body.employeeData.lName,
//             email: req.body.employeeData.email,
//             gender: req.body.employeeData.gender,
//             mobile_number: req.body.employeeData.mobile_number,
//             fatherName: req.body.employeeData.fatherName,
//             motherName: req.body.employeeData.motherName,
//             dob: dobDate,
//             department: req.body.employeeData.department,
//             designation: req.body.employeeData.designation,
//             marital_status: req.body.employeeData.marital_status,
//             blood: req.body.employeeData.blood,
//             password: secPass
//         }];

//         const createdEmployeeData = await EmployeeDetails.create({ employeeData });

//         const data = {
//             employeeData: {
//                 id: createdEmployeeData._id
//             }
//         };

//         const authtoken = jwt.sign(data, JWT_SECRET);
//         res.json({ "authtoken": authtoken });
//     } catch (error) {
//         console.error('Error in creating new user', error);
//         res.status(500).send("Some Error Occurred");
//     }
// });

router.post("/addEmployeeData", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      fatherName,
      motherName,
      dob,
      mobileNumber,
      gender,
      department,
      designation,
      marital_status,
      blood,
      aadharNumber,
      panNumber,
      password,
      correspondenceAddresses, // Add this field
      permanentAddresses, // Add this field
      emergencyDetails,
      educationDetails,
      prevOrganizationDetails,
      employeeRole
    } = req.body;

    const existingEmployeeData = await EmployeeDetails.findOne({
      "employeeData.mobile_number": mobileNumber,
    });
    if (existingEmployeeData) {
      return res
        .status(400)
        .json({ errors: "Sorry a user with this Mobile Number already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const addEmployeeData = await EmployeeDetails.create({
      employeeData: [
        {
          fName: firstName,
          lName: lastName,
          email: email,
          fatherName: fatherName,
          motherName: motherName,
          dob: dob,
          mobile_number: mobileNumber,
          gender: gender,
          department: department,
          designation: designation,
          marital_status: marital_status,
          blood: blood,
          aadharNumber: aadharNumber,
          panNumber: panNumber,
          password: hashedPassword,
          correspondenceAddresses: correspondenceAddresses, // Include this field
          permanentAddresses: permanentAddresses,
          emergencyDetails: emergencyDetails,
          educationDetails: educationDetails,
          prevOrganizationDetails: prevOrganizationDetails,
          employeeRole: employeeRole,
        },
      ],
    });
    const data = {
      employeeData: {
        id: addEmployeeData._id,
      },
    };
    if(data){
      updateEmployeeRecords();
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ authtoken: authtoken });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});

const updateEmployeeRecords = async () => {
  try {
    const employees = await EmployeeDetails.find();

    for (const employee of employees) {
      if (!employee.employeeData[0].user_pin) {
        // Set a default user_pin value here if needed
        employee.employeeData[0].user_pin = '';

        await employee.save();
        console.log(`Updated user_pin for employee with ID: ${employee._id}`);
      }
    }

    console.log('All records updated successfully.');
  } catch (error) {
    console.error('Error updating records:', error);
  }
};



// POST route to submit correspondence and permanent addresses for a specific user by _id
router.post("/submit-addresses/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { correspondenceAddresses, permanentAddresses } = req.body;
    console.log("User ID:", userId);
    console.log("Correspondence Addresses:", correspondenceAddresses);
    console.log("Permanent Addresses:", permanentAddresses);
    const updatedEmployeeDetails = await EmployeeDetails.findOneAndUpdate(
      { "employeeData._id": userId },
      {
        $set: {
          "employeeData.$.correspondenceAddresses": correspondenceAddresses,
          "employeeData.$.permanentAddresses": permanentAddresses,
        },
      },
      { new: true }
    );

    if (!updatedEmployeeDetails) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedEmployeeDetails);
  } catch (error) {
    console.error("Error updating addresses:", error);
    res.status(500).json({ error: "An error occurred while updating addresses" });
  }
});

router.get("/fetchEmployeeData", fetchEmployee, async (req, res) => {
  try {
    const employeeID = req.employeeData.id;
    const employeeData = await EmployeeDetails.findById(employeeID).select(
      "-password"
    );
    if (!employeeData) {
      return res.status(404).json({ errors: "Employee Data not found" });
    }
    res.send(employeeData);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});

router.get("/fetchEmployeeDetails/:id", async (req, res) => {
  try {
    const employeeID = req.params.id;
    console.log('Fetching employee with ID:', employeeID);

    const employeeDataDoc = await EmployeeDetails.findById(employeeID);
    
    if (!employeeDataDoc) {
      return res.status(404).json({ errors: "Employee Data not found" });
    }

    // Access the employeeData array from the retrieved document
    const employeeData = employeeDataDoc.employeeData;
    
    res.send(employeeData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});









// Get all user data
router.get("/fetchAllEmployeeList", async (req, res) => {
  try {
    const employeeData = await EmployeeDetails.find({}).exec();
    res.json(employeeData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred");
  }
});

// Route for fetch unique ID: get
router.get("/fetchUniqueID/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const empId = await EmployeeDetails.findById(id);
    if (!empId) {
      throw "No such record found";
    } else {
      res.json(empId.employeeData[0]);
    }
  } catch (err) {
    console.log("Error in fetching Unique Id");
  }
});

// updating data:
router.put("/fetchUniqueID/:id", (req, res) => {
  const { id } = req.params;
  const {
    fName,
    lName,
    email,
    fatherName,
    motherName,
    dob,
    mobile_number,
    gender,
    department,
    designation,
    marital_status,
    blood,
    aadharNumber,
    password,
    panNumber,
    correspondenceAddresses, // Add this field
    permanentAddresses, // Add this field
    emergencyDetails,
    educationDetails,
    prevOrganizationDetails
  } = req.body;
  EmployeeDetails.findByIdAndUpdate(
    id,
    {
      employeeData: [
        {
          fName: fName,
          lName: lName,
          email: email,
          fatherName: fatherName,
          motherName: motherName,
          dob: dob,
          mobile_number: mobile_number,
          gender: gender,
          department: department,
          designation: designation,
          marital_status: marital_status,
          blood: blood,
          password: password,
          aadharNumber: aadharNumber,
          panNumber: panNumber,
          correspondenceAddresses: correspondenceAddresses, // Include this field
          permanentAddresses: permanentAddresses,
          emergencyDetails: emergencyDetails,
          educationDetails: educationDetails,
          prevOrganizationDetails: prevOrganizationDetails,
        },
      ],
    },
    { new: true }
  )
    .then((updatedEmployee) => {
      if (!updatedEmployee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(updatedEmployee);
    })
    .catch((error) => {
      console.error("Error updating employee:", error);
      res.status(500).json({ error: "Internal server error" });
    });
}); 

  
  
router.put('/updateEmployeeRole/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    const { calibrationEngineer, branchHead } = req.body;

    // Check if both _id and at least one of calibrationEngineer or branchHead is provided
    if (!_id || (calibrationEngineer === undefined && branchHead === undefined)) {
      return res.status(400).json({ error: 'Please provide _id and at least one of calibrationEngineer or branchHead in the request body.' });
    }

    // Find the employee by _id
    const employee = await EmployeeDetails.findOne({ _id });

    // If the employee is not found, return an error
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    // If employeeRole is not initialized with the required fields, initialize it
    if (!employee.employeeData[0].employeeRole) {
      employee.employeeData[0].employeeRole = [];
    }

    // If employeeRole array is empty, add the default values
    if (employee.employeeData[0].employeeRole.length === 0) {
      employee.employeeData[0].employeeRole.push({ calibrationEngineer: false, branchHead: false });
    }

    // Update the employeeRole fields if the corresponding values are provided in the request body
    if (calibrationEngineer !== undefined) {
      employee.employeeData[0].employeeRole[0].calibrationEngineer = calibrationEngineer;
    }

    if (branchHead !== undefined) {
      employee.employeeData[0].employeeRole[0].branchHead = branchHead;
    }

    // Save the updated employee data
    await employee.save();

    return res.status(200).json({ message: 'Employee role updated successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
});



  
  
  

router.delete("/deleteEmployeeData/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedEmployeeData = await EmployeeDetails.findByIdAndDelete(id);

    if (!deletedEmployeeData) {
      throw "No such record found";
    } else {
      try {
        // Backup the deleted data
        const backupData = new DeletedEmployeeData(
          deletedEmployeeData.toObject()
        );
        await backupData.save();
      } catch (backupError) {
        console.error("Backup error:", backupError.message);
        // You can decide how to handle the backup error, whether to log it or send a response indicating a backup failure.
      }

      res.json({ message: "Employee data deleted successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred");
  }
});

module.exports = router;
