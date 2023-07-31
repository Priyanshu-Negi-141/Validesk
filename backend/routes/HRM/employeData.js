

const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const moment = require('moment')
const EmployeeData = require("../../module/EmployeeData")
const DeletedEmployeeData = require("../../module/DeletedEmployeeData");
const {body, validationResult} = require('express-validator')
var jwt = require('jsonwebtoken')
const JWT_SECRET = "ValidexIndia"
var fetchEmployee = require("../../middleware/fetchEmployee")


// Create a employee using POST
router.post('/addEmployeeData',[
  body('fName', 'Enter atleast 3 Character').isLength({min:3}),
  body('email', 'Enter a valid email').isEmail(),
  body('password', "Password must have 5 character").isLength({min:5}),
] ,async(req,res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({
        errors: errors.array()
      })
    }
    // check whether the user with this email already exist
    let employeeData = await EmployeeData.findOne({email: req.body.email})
    if(employeeData){
      return res.status(400).json({errors: "Sorry a user with this email already exist"})
    }
      const salt = await bcrypt.genSalt(10)
      const secPass =await bcrypt.hash(req.body.password, salt)
      const dob = req.body.dob
      const dobDate = moment(dob, 'DD-MM-YYYY').format('DD-MM-YYYY')
      employeeData = await EmployeeData.create({
      fName: req.body.fName,
      lName: req.body.lName,
      email: req.body.email,
      gender: req.body.gender,
      mobile_number: req.body.mobile_number,
      fatherName: req.body.fatherName,
      motherName: req.body.motherName,
      dob: dobDate,
      department: req.body.department,
      designation: req.body.designation,
      marital_status: req.body.marital_status,
      blood: req.body.blood,
      password: secPass
    })
    const data = {
      employeeData:{
        id : employeeData._id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET)
    res.json({"authtoken": authtoken})
  } catch (error) {
    console.error('Error in creating new user', error);
    res.status(500).send("Some Error Occured")
  }
})


// Get loggedin User Data:

router.get('/fetchEmployeeData',fetchEmployee, async (req,res) => {
  try {
    const employeeID = req.employeeData.id
    const employeeData = await EmployeeData.findById(employeeID).select("-password")
    if (!employeeData) {
      return res.status(404).json({ error: "Employee data not found" });
    }
    res.send(employeeData)
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Serval Error")
  }
})

// Get all user data
router.get("/fetchAllEmployeeList", async (req, res) => {
  try {
    const employeeData = await EmployeeData.find({}).exec();
    res.json(employeeData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occurred");
  }
});

// Route for fetch unique ID: get
router.get('/fetchUniqueID/:id',async(req,res)=>{
    try{
        let id= req.params.id
        const empId=await EmployeeData.findById(id);
        if(!empId){
            throw "No such record found";
        }else{
            res.json(empId);
        }
    }catch(err){
        console.log('Error in fetching Unique Id');
    };
});

// updating data:
router.put('/fetchUniqueID/:id',(req,res) => {
  const{id} = req.params;
  const {
    fName,
    lName,
    email,
    fatherName,
    motherName,
    dob,
    mobile_number,
    gender,
  } = req.body
  EmployeeData.findByIdAndUpdate(id,{
    fName,
    lName,
    email,
    fatherName,
    motherName,
    dob,
    mobile_number,
    gender,
  }, {new: true})
  .then((updatedEmployee) => {
    if(!updatedEmployee){
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(updatedEmployee)
  })
  .catch((error) => {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  });
})


// Delete Employee

// router.delete("/deleteEmployeeData/:id", fetchEmployee, async(req,res) => {
//   try {
//     const {fName,lName,email,fatherName,motherName,dob,mobile_number,gender} = req.body
//     let employeeData = await EmployeeData.findById(req.params.id)
//     if(!employeeData){
//       return res.status(401).json('No such User')
//     }
//     if(employeeData._id.toString() !== req._id.id){
//       return res.status(403).json('You are not authorized to delete this note!')
//     }
//     employeeData = await EmployeeData.findByIdAndDelete(req.params.id)
//     res.json({Success: "Employee has been deleted", employeeData: employeeData })

//   } catch (error) {
//     console.error(error.message)
//     res.status(500).send("Some Error Occured")
//   }
// })

router.delete("/deleteEmployeeData/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const deletedEmployeeData = await EmployeeData.findByIdAndDelete(id);
      if (!deletedEmployeeData) {
        throw "No such record found";
      } else {
        // Backup the deleted data
        const backupData = new DeletedEmployeeData(deletedEmployeeData.toObject());
        await backupData.save();
  
        res.json({ message: "Employee data deleted successfully" });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occurred");
    }
  });





module.exports = router
































// const express = require("express")
// const router = express.Router()
// const EmployeeData = require("../../module/EmployeeData")
// const DeletedEmployeeData = require("../../module/DeletedEmployeeData");
// const { validationResult } = require("express-validator")


// // Route 1:Adding all the employee data using: POST
// router.post("/addEmployeeData", async(req, res) => {
//     try{
//         const {fName, lName, fatherName, motherName, email, dob, gender, mobile_number, password} = req.body
//         // const errors = validationResult(req)
//         // if(!errors.isEmpty()){
//         //     return res.status(400).json({errors: errors.array() })
//         // }
//         // Check if the user already exists based on email
//         const existingEmployee = await EmployeeData.findOne({ email });
//         if (existingEmployee) {
//           return res.status(400).json({ error: "Employee already exists" });
//       }
//         const employeeData = new EmployeeData({
//             fName,
//             lName,
//             fatherName,
//             motherName,
//             email,
//             dob,
//             gender,
//             mobile_number,
//             password
//         })
//         const savedEmployeeData = await employeeData.save()
//         res.json(savedEmployeeData)
//     } catch (error){
//         console.error(error.message)
//         res.status(500).send("Some Error occured")
//     }
// })

// // Route for fetch data: Get
// router.get('/fetchEmployeeData', async(req,res) => {
//     try {
//         const employeeData = await EmployeeData.find()
//         res.json(employeeData)
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// })

// // Route for fetch unique ID: get
// router.get('/fetchUniqueID/:id',async(req,res)=>{
//     try{
//         let id= req.params.id
//         const empId=await EmployeeData.findById(id);
//         if(!empId){
//             throw "No such record found";
//         }else{
//             res.json(empId);
//         }
//     }catch(err){
//         console.log('Error in fetching Unique Id');
//     };
// });

// // Route for deleting data: DELETE
// router.delete("/deleteEmployeeData/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const deletedEmployeeData = await EmployeeData.findByIdAndDelete(id);
//     if (!deletedEmployeeData) {
//       throw "No such record found";
//     } else {
//       // Backup the deleted data
//       const backupData = new DeletedEmployeeData(deletedEmployeeData.toObject());
//       await backupData.save();

//       res.json({ message: "Employee data deleted successfully" });
//     }
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Some error occurred");
//   }
// });

//   // Route for recovering the last deleted data: GET
// router.get("/recoverLastDeletedData", async (req, res) => {
//   try {
//     const lastDeletedData = await DeletedEmployeeData.findOne().sort({
//       createdAt: -1,
//     });
//     if (!lastDeletedData) {
//       throw "No deleted data found";
//     } else {
//       // Restore the last deleted data
//       const restoredData = new EmployeeData(lastDeletedData.toObject());
//       await restoredData.save();

//       // Delete the restored data from the backup collection
//       await DeletedEmployeeData.findByIdAndDelete(lastDeletedData._id);

//       res.json({ message: "Last deleted data recovered successfully" });
//     }
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Some error occurred");
//   }
// });
  
// // Route for updating data: PUT
// router.put("/updateEmployeeData/:id", async (req, res) => {
//     try {
//       const id = req.params.id;
//       const { fName, lName, fatherName, motherName, email, dob, gender, mobile_number, password } = req.body;
  
//       const updatedEmployeeData = await EmployeeData.findByIdAndUpdate(
//         id,
//         {
//             fName,
//             lName,
//             fatherName,
//             motherName,
//             email,
//             dob,
//             gender,
//             mobile_number,
//             password
//         },
//         { new: true }
//       );
  
//       if (!updatedEmployeeData) {
//         throw "No such record found";
//       } else {
//         res.json(updatedEmployeeData);
//       }
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send("Some error occurred");
//     }
//   });



// module.exports = router;