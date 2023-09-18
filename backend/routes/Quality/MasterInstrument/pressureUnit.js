const express = require("express");
const fetchEmployee = require("../../../middleware/fetchEmployee");
const PressureUnitData = require("../../../module/Quality/MasterInstrument/PressureUnit");
const EmployeeDetails = require("../../../module/HRM/Employee/AddEmployee/EmployeeDetails");
const router = express.Router()


// router.post('/addPressureUnit', async(req,res) => {
//     try {
//         const pressureData = req.body
//         console.log(pressureData)
//     } catch (error) {
        
//     }
// })


router.post("/addPressureUnit", fetchEmployee, async (req, res) => {
    const employee = await EmployeeDetails.findById(req.employeeData.id);
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Employee not found",
        data: null,
      });
    } else {
      try {
        const pressureDataArray = req.body;
  
        // Fetch all existing pressure unit data
        const existingPressureData = await PressureUnitData.find();
  
        const insertedPressure = [];
  
        for (const { unit, symbol, value } of pressureDataArray) {
          // Check if the unit already exists in the database
          const existingUnitData = existingPressureData.find(
            (data) => data.unit === unit
          );
  
          if (existingUnitData) {
            // If the unit already exists, update it instead of adding a new one
            existingUnitData.symbol = symbol;
            existingUnitData.value = value;
            await existingUnitData.save();
            insertedPressure.push(existingUnitData);
          } else {
            const pressureUnitData = { unit, symbol, value };
            const newPressureUnitData = new PressureUnitData(pressureUnitData);
            await newPressureUnitData.save();
            insertedPressure.push(newPressureUnitData);
          }
        }
  
        // Remove any pressure unit data that wasn't in the request
        const unitsToRemove = existingPressureData.filter(
          (data) =>
            !pressureDataArray.some((item) => item.unit === data.unit)
        );
  
        for (const dataToRemove of unitsToRemove) {
          await dataToRemove.remove();
        }
  
        res.status(200).json({
          status: true,
          message: "Unit Data added or updated Successfully",
          data: insertedPressure,
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
router.get('/getPressureUnit',fetchEmployee, async (req, res) => {
    const employee = await EmployeeDetails.findById(req.employeeData.id);
    if (!employee) {
      return res
        .status(404)
        .json({ status: false, message: "Employee not found", data: null });    
    } else {
        try {
        const pressureData = await PressureUnitData.find();
        res.status(200).json({
            status: true,
            data: pressureData
        }); 
        } catch (error) {
        console.error('Error fetching Data:', error);
        res.status(500).json({
            status: false,
            message: 'An error occurred while fetching Pressure Unit',
            data: error
        });
        }
    }
  });


  router.delete("/deletePressureUnit/:id", fetchEmployee, async (req, res) => {
    const employee = await EmployeeDetails.findById(req.employeeData.id);
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Employee not found",
        data: null,
      });
    } else {
      try {
        const pressureUnitId = req.params.id;
  
        // Check if the pressure unit data exists
        const pressureUnitData = await PressureUnitData.findById(pressureUnitId);
  
        if (!pressureUnitData) {
          return res.status(404).json({
            status: false,
            message: "Pressure Unit Data not found",
            data: null,
          });
        }
  
        // Delete the pressure unit data using .deleteOne()
        await PressureUnitData.deleteOne({ _id: pressureUnitId });
  
        res.status(200).json({
          status: true,
          message: "Pressure Unit Data deleted successfully",
          data: pressureUnitData, // You can send the deleted data if needed
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
  
  
  


module.exports = router;