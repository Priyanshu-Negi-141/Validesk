const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const bodyParser = require('body-parser')
const EmployeeData = require("../module/EmployeeData")
const {body, validationResult} = require('express-validator')
var jwt = require('jsonwebtoken')
const JWT_SECRET = "ValidexIndia"
var fetchEmployee = require("../middleware/fetchEmployee")
const EmployeeDetails = require("../module/HRM/Employee/AddEmployee/EmployeeDetails")

// Authenticate user
router.post('/login',[
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists().notEmpty()
  ] ,async(req,res) => {
    try {
      let success = false
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({
          errors: errors.array()
        })
      }
      const {email,password} = req.body
      try {
        let employeeData = await EmployeeData.findOne({email});
        if(!employeeData){
          success = false
          return res.status(400).json({success,error: "Please try to login with correct credentials"})
        }
        const passwordCompare = await bcrypt.compare(password, employeeData.password)
        if(!passwordCompare){
          return res.status(400).json({success, error: "Please try to login with correct credentials"})
        }
        const data = {
          employeeData:{
            id : employeeData._id
          }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({success,"authtoken": authtoken})
      } catch (error) {
        console.error('Error in Login user', error);
        res.status(500).send("Internal Server Error")
      }
    } catch (error) {
      console.error('Error in Login user', error);
      res.status(500).send("Some Error Occured")
    }
  })

  // Authenticate user with mobile
  // router.post('/loginEmployee', [
  //   body('mobile_number', 'Enter a valid Mobile Number').exists().notEmpty().isMobilePhone(),
  //   body('password', 'Password cannot be blank').exists().notEmpty()
  // ], async (req, res) => {
  //   try {
  //     let success = false;
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res.status(400).json({
  //         errors: errors.array()
  //       });
  //     }
  //     const { mobile_number, password } = req.body;
  //     try {
  //       let employeeData = await EmployeeData.findOne({ mobile_number });
  //       if (!employeeData) {
  //         // If no employee data found, create a default admin account
  //         const defaultAdminData = {
  //           mobile_number: '00001',
  //           password: 'admin' // You can set a secure password here
  //         };
  //         employeeData = await EmployeeData.create(defaultAdminData);
  //         success = true;
  //       } else {
  //         const passwordCompare = await bcrypt.compare(password, employeeData.password);
  //         if (!passwordCompare) {
  //           return res.status(400).json({ success, error: "Please try to login with correct password" });
  //         }
  //       }
  
  //       const data = {
  //         employeeData: {
  //           id: employeeData._id
  //         }
  //       };
  //       const authtoken = jwt.sign(data, JWT_SECRET);
  //       success = true;
  //       res.json({ success, "authtoken": authtoken });
  //     } catch (error) {
  //       console.error('Error in Login user', error);
  //       res.status(500).send("Internal Server Error");
  //     }
  //   } catch (error) {
  //     console.error('Error in Login user', error);
  //     res.status(500).send("Some Error Occurred");
  //   }
  // });

// The below code is good don't delete it it might use in future
  // router.post('/loginEmployee', [
  //   body('mobile_number', 'Enter a valid Mobile Number').exists().notEmpty().isMobilePhone(),
  //   body('password', 'Password cannot be blank').exists().notEmpty()
  // ], async (req, res) => {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return res.status(400).json({
  //         errors: errors.array()
  //       });
  //     }
      
  //     const { mobile_number, password } = req.body;
  //     try {
  //       let employeeData = await EmployeeDetails.findOne({
  //         'employeeData.mobile_number': mobile_number
  //       });
  //       if (!employeeData) {
  //         return res.status(400).json({ success: false, error: "No employee data found" });
  //       }
  
  //         const passwordCompare = await bcrypt.compare(password, employeeData.employeeData[0].password);
        
  //         if (!passwordCompare) {
  //           return res.status(400).json({ success: false, error: "Invalid password" });
  //         }
        
  //         const data = {
  //           employeeData: {
  //             id: employeeData._id
  //           }
  //         };
        
  //         const authtoken = jwt.sign(data, JWT_SECRET);
                
  //         res.json({ success: true, authtoken });
  //       } catch (error) {
  //         console.error('Error comparing passwords:', error);
  //         res.status(500).send("Internal Server Error");
  //       }
  //   } catch (error) {
  //     console.error('Error in Login user', error);
  //     res.status(500).send("Some Error Occurred");
  //   }
  // });
// The End 


  router.post(
    '/loginEmployee',
    [
      body('mobile_number', 'Enter a valid Mobile Number').exists().notEmpty().isMobilePhone(),
      body('password', 'Password cannot be blank').exists().notEmpty(),
    ],
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
          });
        }
  
        const { mobile_number, password } = req.body;
        try {
          let employeeData = await EmployeeDetails.findOne({
            'employeeData.mobile_number': mobile_number,
          });
          if (!employeeData) {
            return res.status(400).json({ success: false, error: 'No employee data found' });
          }
  
          const passwordCompare = await bcrypt.compare(password, employeeData.employeeData[0].password);
  
          if (!passwordCompare) {
            return res.status(400).json({ success: false, error: 'Invalid password' });
          }
  
          const data = {
            employeeData: {
              id: employeeData._id,
            },
          };
  
          if (employeeData.employeeData[0].pin === null) {
            // Ask user to create a PIN since it's their first-time login
            return res.json({ success: true, createPin: true });
          }
  
          const authtoken = jwt.sign(data, JWT_SECRET);
  
          res.json({ success: true, authtoken });
        } catch (error) {
          console.error('Error comparing passwords:', error);
          res.status(500).send('Internal Server Error');
        }
      } catch (error) {
        console.error('Error in Login user', error);
        res.status(500).send('Some Error Occurred');
      }
    }
  );
  
  router.post('/createPin', fetchEmployee, async (req, res) => {
    try {
      const { pin } = req.body;
  
      const userId = req.employeeData.id;
  
      // Check if the user has already created a PIN
      const employee = await EmployeeDetails.findById(userId);
      if (!employee) {
        return res.status(400).json({ success: false, error: 'User not found' });
      }
  
      if (employee.employeeData[0].user_pin) {
        return res.status(400).json({ success: false, error: 'User already has a PIN' });
      }
  
      // Hash the PIN (assuming the pin is a numeric string)
      const hashedPin = await bcrypt.hash(pin, 10);
  
      // Validate required fields before saving
      if (!employee.employeeData[0].department || !employee.employeeData[0].designation) {
        return res.status(400).json({ success: false, error: 'Missing department or designation' });
      }
  
      // Update the user's user_pin in the database
      employee.employeeData[0].user_pin = hashedPin;
      await employee.save();
  
      // Return a success response
      res.json({ success: true, message: 'PIN created successfully' });
    } catch (error) {
      console.error('Error creating PIN:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.post('/loginWithPin',fetchEmployee, async (req, res) => {
    try {
      // const authToken = req.headers['auth-token']; // Get authToken from headers
      const { pin } = req.body;
  
      // Verify the authToken
      try {
        const userId = req.employeeData.id;
  
        // Find the user in the database
        const employee = await EmployeeDetails.findById(userId);
  
        if (!employee) {
          return res.status(400).json({ success: false, error: 'User not found' });
        }
  
        // Compare the provided pin with the stored hashed user_pin
        const pinMatch = await bcrypt.compare(pin, employee.employeeData[0].user_pin);
  
        if (!pinMatch) {
          return res.status(400).json({ success: false, error: 'Invalid PIN' });
        }
  
        // If the PIN matches, create a new JWT token for the user
        const data = {
          employeeData: {
            id: employee._id
          }
        };
        const newAuthToken = jwt.sign(data, JWT_SECRET);
  
        // Return the new JWT token as the response
        res.json({ success: true, authtoken: newAuthToken });
      } catch (error) {
        console.error('Error verifying authToken:', error);
        res.status(401).json({ success: false, error: 'Invalid authToken' });
      }
    } catch (error) {
      console.error('Error logging in with PIN:', error);
      res.status(500).send('Internal Server Error');
    }
  });
    
  
  
module.exports = router