const express = require('express');
const MasterInstrumentData = require('../../../module/Quality/MasterInstrument/MasterInstrumentDetails');
const EmployeeDetails = require('../../../module/HRM/Employee/AddEmployee/EmployeeDetails');
const fetchEmployee = require('../../../middleware/fetchEmployee');
const RgpData = require('../../../module/RGP-DC/RGP/RgpData');
const router = express.Router()


// router.get("/masterInstrumentList", async (req, res) => {
//     try {
//       const masterList = await MasterInstrumentData.find({})
//         .select("_id instrument_name id_number")
//         .exec();
  
//       res.status(200).json({ masterList });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });



// Define a route to fetch checkOutMaster values and statuses for all documents
router.get("/masterInstrumentList", async (req, res) => {
  try {
    // Fetch the filteredCheckOutMasterList as you did before
    const rgpDataList = await RgpData.find();

    if (!rgpDataList) {
      return res.status(404).json({ message: "No RgpData found" });
    }

    const filteredCheckOutMasterList = rgpDataList.flatMap((rgpData) =>
      rgpData.checkOutMaster
        .filter((item) => item.status === "Selected")
        .map((item) => item.value)
    );

    // Query the MasterInstrumentData collection to exclude the matching values
    const masterList = await MasterInstrumentData.find({
      _id: { $nin: filteredCheckOutMasterList }, // Exclude matching _id values
    }).select("_id instrument_name serial_number id_number");

    res.status(200).json({ masterList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


  router.get("/employeeList", async (req, res) => {
    try {
      const masterList = await EmployeeDetails.find({})
        .select("_id")
        .exec();
  
      res.status(200).json({ masterList });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/masterInstrument/:instrumentId", async (req, res) => {
    try {
        const instrumentId = req.params.instrumentId;
        const masterInstru = await MasterInstrumentData.findById({"_id" : instrumentId})
        if(!masterInstru){
            return  res.status(401).send("Not found");
        }
        // If the instrument is found, send the instrument details
    res.status(200).json({
        instrument_name: masterInstru.instrument_name,
        id_number: masterInstru.id_number,
        serial_number: masterInstru.serial_number
      });
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });




  // Adding Data in the db

  router.post("/addRgpData",fetchEmployee, async(req,res) => {
    try {
      const rgpData = req.body
      const employee = await EmployeeDetails.findById(req.employeeData.id);
      if (!employee) {
        return res
          .status(404)
          .json({ status: false, message: "Employee not found", data: null });
      }
      const employeeData = employee.employeeData[0]; // Assuming there's only one entry in the array
      // console.log(employeeData)
      const newRgpData = await RgpData(rgpData)
      await newRgpData.save()
      res.status(200).json({
        status: true,
        message: "RGP Data added Successfully",
        data: newRgpData,
      });
      // console.log(rgpData)
    } catch (error) {
      console.log(error)
    }
  })

  

  

// Define a route to fetch checkOutMaster values and statuses for all documents
router.get("/checkOutMaster", async (req, res) => {
  try {
    const rgpDataList = await RgpData.find();

    if (!rgpDataList) {
      return res.status(404).json({ message: "No RgpData found" });
    }

    // Extract and filter the checkOutMaster values and statuses for all documents
    const filteredCheckOutMasterList = rgpDataList.flatMap((rgpData) =>
      rgpData.checkOutMaster
        .filter((item) => item.status === "Selected")
        .map((item) => ({
          value: item.value,
          status: item.status,
        }))
    );

    res.json(filteredCheckOutMasterList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});



  
  


  // 
  
  

  // fetching ClientDetails like address and name

  




  // client Session ends




module.exports = router;