const express = require('express');
const MasterInstrumentData = require('../../../module/Quality/MasterInstrument/MasterInstrumentDetails');
const EmployeeDetails = require('../../../module/HRM/Employee/AddEmployee/EmployeeDetails');
const router = express.Router()


router.get("/masterInstrumentList", async (req, res) => {
    try {
      const masterList = await MasterInstrumentData.find({})
        .select("_id instrument_name id_number")
        .exec();
  
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
  
  


module.exports = router;