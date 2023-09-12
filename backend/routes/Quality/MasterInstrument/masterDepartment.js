const express = require("express");
const MasterDepartmentData = require("../../../module/Quality/MasterInstrument/MasterDepartment");
const fetchEmployee = require("../../../middleware/fetchEmployee");
const router = express.Router();
const EmployeeDetails = require("../../../module/HRM/Employee/AddEmployee/EmployeeDetails")

// router.post("/addMasterDepartment", async(req,res) => {
//     try {
//         const [{ departmentName, streamDetails }] = req.body;
//         const verifyDepartment = await MasterDepartmentData.findOne({ departmentName: departmentName })
//         if(verifyDepartment){
//             return res.status(400).json({
//                 status: false,
//                 message: "This Department Name is already exist",
//                 data: verifyDepartment
//             })
//         } else {
//             const masterDepartmentData = {departmentName, streamDetails}
//             const newMasterDepartmentData = new MasterDepartmentData(masterDepartmentData)
//             await newMasterDepartmentData.save()
//             res.status(200).json({
//                 status: true,
//                 message: "Department Data added Successfully",
//                 data: newMasterDepartmentData
//             })
//         }
//     } catch (error) {
//         console.log('err', error);
//         res.status(500).json({
//             status: false,
//             message: "An error occurred",
//             data: error
//         })
//     }
// })

router.post("/addMasterDepartment",fetchEmployee, async (req, res) => {
    const employee = await EmployeeDetails.findById(req.employeeData.id);
    if (!employee) {
      return res
        .status(404)
        .json({ status: false, message: "Employee not found", data: null });    
    } else {
        try {
            const departmentDataArray = req.body;
        
            const insertedDepartments = [];
        
            for (const { departmentName, streamDetails } of departmentDataArray) {
              const verifyDepartment = await MasterDepartmentData.findOne({
                departmentName: departmentName,
              });
        
              if (verifyDepartment) {
                return res.status(400).json({
                  status: false,
                  message: "This Department Name is already exist",
                  data: verifyDepartment,
                });
              } else {
                const masterDepartmentData = { departmentName, streamDetails };
                const newMasterDepartmentData = new MasterDepartmentData(
                  masterDepartmentData
                );
                await newMasterDepartmentData.save();
                insertedDepartments.push(newMasterDepartmentData);
              }
            }
        
            res.status(200).json({
              status: true,
              message: "Departments Data added Successfully",
              data: insertedDepartments,
            });
          } catch (error) {
            console.log("err", error);
            res.status(500).json({
              status: false,
              message: "An error occurred",
              data: error,
            });
          } 
    }
  
});


// GET all MasterDepartmentData
router.get('/masterDepartmentData',fetchEmployee, async (req, res) => {
    const employee = await EmployeeDetails.findById(req.employeeData.id);
    if (!employee) {
      return res
        .status(404)
        .json({ status: false, message: "Employee not found", data: null });    
    } else {
        try {
        const departments = await MasterDepartmentData.find();
        res.status(200).json({
            status: true,
            data: departments
        }); 
        } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({
            status: false,
            message: 'An error occurred while fetching departments',
            data: error
        });
        }
    }
  });
  
  // GET a specific MasterDepartmentData by ID
  router.get('/masterDepartmentData/:id',fetchEmployee, async (req, res) => {
    const employee = await EmployeeDetails.findById(req.employeeData.id);
    if (!employee) {
      return res
        .status(404)
        .json({ status: false, message: "Employee not found", data: null });    
    } else {
        const { id } = req.params;
        try {
        const department = await MasterDepartmentData.findById(id);
        if (!department) {
            return res.status(404).json({
            status: false,
            message: 'Department not found'
            });
        }
        res.status(200).json({
            status: true,
            data: department
        });
        } catch (error) {
        console.error('Error fetching department by ID:', error);
        res.status(500).json({
            status: false,
            message: 'An error occurred while fetching department by ID',
            data: error
        });
        }
    }
  });
  
  // PUT (Update) a specific MasterDepartmentData by ID
  router.put("/updateMasterDepartment/:departmentId", fetchEmployee, async (req, res) => {
    const employee = await EmployeeDetails.findById(req.employeeData.id);
    if (!employee) {
      return res
        .status(404)
        .json({ status: false, message: "Employee not found", data: null });
    } else {
      try {
        const departmentId = req.params.departmentId;
        const updatedDepartmentData = req.body;
  
        // Check if the department with the given ID exists
        const existingDepartment = await MasterDepartmentData.findById(departmentId);
  
        if (!existingDepartment) {
          return res.status(404).json({
            status: false,
            message: "Department not found",
            data: null,
          });
        }
  
        // Use $set to update specific fields of the department data
        if (updatedDepartmentData.departmentName) {
          existingDepartment.departmentName = updatedDepartmentData.departmentName;
        }
  
        if (updatedDepartmentData.streamDetails) {
          existingDepartment.streamDetails = updatedDepartmentData.streamDetails;
        }
  
        // Save the updated department data
        await existingDepartment.save();
  
        res.status(200).json({
          status: true,
          message: "Department Data updated Successfully",
          data: existingDepartment,
        });
      } catch (error) {
        console.log("err", error);
        res.status(500).json({
          status: false,
          message: "An error occurred",
          data: error,
        });
      }
    }
  });
  
  
  
  
  // DELETE a specific MasterDepartmentData by ID
  router.delete('/masterDepartmentData/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
      const deletedDepartment = await MasterDepartmentData.findByIdAndRemove(id);
      if (!deletedDepartment) {
        return res.status(404).json({
          status: false,
          message: 'Department not found'
        });
      }
      res.status(200).json({
        status: true,
        message: 'Department deleted successfully',
        data: deletedDepartment
      });
    } catch (error) {
      console.error('Error deleting department:', error);
      res.status(500).json({
        status: false,
        message: 'An error occurred while deleting department',
        data: error
      });
    }
  });



  // New things

  // Define a route to get department names
  router.get('/departments', async (req, res) => {
    try {
      const departments = await MasterDepartmentData.find({}, '_id departmentName');
      res.json(departments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.get('/streamName/:departmentId', async(req,res) => {
    const departmentId = req.params.departmentId
    try {
      const stream = await MasterDepartmentData.findById(departmentId)
      if(!stream){
        return res.status(404).json({ error: 'Stream not found' });
      }
      res.json(stream.streamDetails[0].streamName);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  



module.exports = router;
