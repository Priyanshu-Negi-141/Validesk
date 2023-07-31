const express = require('express')
const router = express.Router()
const { body, validationResult } = require("express-validator");
const DayReportData = require('../../module/DayReport');
var fetchEmployee = require("../../middleware/fetchEmployee");
const EmployeeData = require('../../module/EmployeeData');



// Post DayReport Data to the DataBase

router.post("/addDayReport", fetchEmployee , [
    body("SiteName", "Enter Site Name").isLength({min: 2}),
    body("Description", "Description atleast 3 character").isLength({ min: 3 }),
],async(req,res) => {
    try {
        const {Date,CheckInType,SiteName,Activity,Description} = req.body
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }    
        const employee = await EmployeeData.findById(req.employeeData.id)
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
          }
        const dayReport = new DayReportData({
            Date : Date,
            CheckInType : CheckInType,
            Description : Description,
            SiteName : SiteName,
            Activity: Activity,
            Employee: {
                id: employee.id,
                fName: employee.fName,
                lName: employee.lName,
                department: employee.department,
            }
        })   
        const saveDayReport = await dayReport.save()
        res.json(saveDayReport)
    } catch (error) {
        console.error(error.message);
      res.status(500).send("Some Error occured");
    }

})

// Get only that data which user send data in daily activity

router.get("/dayReportEmployeeData", fetchEmployee, async(req,res) => {
    try {
        const employee = await EmployeeData.findById(req.employeeData.id)
        if(!employee){
            return res.status(404).json({error: "Employee not found"})
        }
        const dayReportData = await DayReportData.find({"Employee.id": employee.id})
        res.json(dayReportData)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some Error Occure")
        
    }
})


// GetDayReportData from Backend

// router.get('/getDayReportData', async(req, res) => {
//     try{
//         const {department, date, checkInType} = req.query
//         let query = {}
//         if(department){
//             query["Employee.department"] = department
//         }
//         if (date){
//             query['Date'] = date;
//         }
//         if(checkInType){
//             query['CheckInType'] = checkInType;
//         }
//         const dayReportData = await DayReportData.find(query)
//         res.json(dayReportData)
//     } catch (error){
//         console.error(error.message);
//         res.status(500).send("Some error occurred");
//     }
// })


// Geting data for Calibration Site Data 

router.get('/calibration-site', async (req, res) => {
    try {
      const filter = {
        Activity: 'Calibration',
        CheckInType: 'Site'
      };
  
      const calibrationData = await DayReportData.find(filter);
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
        Activity: 'Calibration',
        CheckInType: 'Office'
      };
  
      const calibrationData = await DayReportData.find(filter);
      res.json(calibrationData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Geting data for HVAC Site Data 

router.get('/hvac-site', async (req, res) => {
    try {
      const filter = {
        Activity: 'HVAC',
        CheckInType: 'Site'
      };
  
      const calibrationData = await DayReportData.find(filter);
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
        Activity: 'HVAC',
        CheckInType: 'Office'
      };
  
      const calibrationData = await DayReportData.find(filter);
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
        Activity: 'Thermal',
        CheckInType: 'Site'
      };
  
      const calibrationData = await DayReportData.find(filter);
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
        Activity: 'Thermal',
        CheckInType: 'Office'
      };
  
      const calibrationData = await DayReportData.find(filter);
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
        Activity: 'PLC-CSV',
        CheckInType: 'Site'
      };
  
      const calibrationData = await DayReportData.find(filter);
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
        Activity: 'PLC-CSV',
        CheckInType: 'Office'
      };
  
      const calibrationData = await DayReportData.find(filter);
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
        Activity: 'CA',
        CheckInType: 'Site'
      };
  
      const calibrationData = await DayReportData.find(filter);
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
        Activity: 'CA',
        CheckInType: 'Office'
      };
  
      const calibrationData = await DayReportData.find(filter);
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
        Activity: 'Steam',
        CheckInType: 'Site'
      };
  
      const calibrationData = await DayReportData.find(filter);
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
        Activity: 'Steam',
        CheckInType: 'Office'
      };
  
      const calibrationData = await DayReportData.find(filter);
      res.json(calibrationData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



// Get DayReport Data

router.get('/getDayReportData', async(req,res) => {
    const firstName = req.params.firstName
    try {
        const employee = await EmployeeData.findOne({fName: firstName}, 'fName lName').exec()
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
          }
        const reports = await DayReportData.find({Employee:employee._id}).exec()
        const result = {
            employee: {
                fName: employee.fName,
                lName: employee.lName
            },
            reports: reports,
        }
        res.json(result)
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


module.exports = router