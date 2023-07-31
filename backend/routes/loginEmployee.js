const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const bodyParser = require('body-parser')
const EmployeeData = require("../module/EmployeeData")
const {body, validationResult} = require('express-validator')
var jwt = require('jsonwebtoken')
const JWT_SECRET = "ValidexIndia"
var fetchEmployee = require("../middleware/fetchEmployee")

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
  router.post('/loginEmployee', [
    body('mobile_number', 'Enter a valid Mobile Number').exists().notEmpty().isMobilePhone(),
    body('password', 'Password cannot be blank').exists().notEmpty()
  ], async (req, res) => {
    try {
      let success = false;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
      const { mobile_number, password } = req.body;
      try {
        let employeeData = await EmployeeData.findOne({ mobile_number });
        if (!employeeData) {
          // If no employee data found, create a default admin account
          const defaultAdminData = {
            mobile_number: '00001',
            password: 'admin' // You can set a secure password here
          };
          employeeData = await EmployeeData.create(defaultAdminData);
          success = true;
        } else {
          const passwordCompare = await bcrypt.compare(password, employeeData.password);
          if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login with correct password" });
          }
        }
  
        const data = {
          employeeData: {
            id: employeeData._id
          }
        };
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, "authtoken": authtoken });
      } catch (error) {
        console.error('Error in Login user', error);
        res.status(500).send("Internal Server Error");
      }
    } catch (error) {
      console.error('Error in Login user', error);
      res.status(500).send("Some Error Occurred");
    }
  });
  

module.exports = router