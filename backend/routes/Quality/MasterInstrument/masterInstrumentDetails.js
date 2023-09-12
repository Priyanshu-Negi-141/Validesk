const express = require("express");
const MasterInstrumentData = require("../../../module/Quality/MasterInstrument/MasterInstrumentDetails");
const router = express.Router();


router.post("/addMasterInstrumentData", async (req, res) => {
    try {
      const masterInstrumentData = req.body; // Assuming the request body contains the data to be stored
  
      const newMasterInstrumentData = new MasterInstrumentData(masterInstrumentData);
      await newMasterInstrumentData.save();
      res
        .status(200)
        .json({status:true, message: "Data saved successfully in CalibrationMaster" });
    } catch (error) {
      res
        .status(500)
        .json({
          error: "An error occurred while saving the data in CalibrationMaster",
          data: error,
        });
        console.log(error)
        
    }
  });


  router.get("/fetchMasterInstrumentData", async (req, res) => {
    try {
      // Aggregate data based on department.id and group by it
      const data = await MasterInstrumentData.aggregate([
        {
          $group: {
            _id: "$department.id",
            departmentData: { $push: "$$ROOT" },
          },
        },
      ]);
  
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({
        error: "An error occurred while fetching the data",
        data: error,
      });
      console.error(error);
    }
  });


// Sanju Jija ji ko dene wali api
  router.get("/fetchInstrumentDataByDepartment/:departmentId", async (req, res) => {
    try {
      const departmentId = req.params.departmentId;
      if (!departmentId) {
        return res.status(400).json({status: false, message: "Department ID is required", data: error });
      }
      // Fetch data based on the provided department ID
      const instrumentData = await MasterInstrumentData.find({
        "department.id": departmentId,
      });
  
      res.status(200).json({status:true, message: "Master Instrument Data Fetched Successfully" ,data: instrumentData });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "An error occurred while fetching the data",
        data: error,
      });
      console.error(error);
    }
  });

//   Sanju jija ji ko dene wali api khtm huii idhr




// fetchInstrument By ID

router.get("/fetchInstrumentDataById/:instrumentId", async (req, res) => {
  try {
    const instrumentId = req.params.instrumentId;
    if (!instrumentId) {
      return res.status(400).json({status: false, message: "Instrument ID is found", data: error });
    }
    // Fetch data based on the provided department ID
    const instrumentData = await MasterInstrumentData.find({
      "_id": instrumentId,
    });

    res.status(200).json({status:true, message: "Master Instrument Data Fetched Successfully" ,data: instrumentData });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching the data",
      data: error,
    });
    console.error(error);
  }
});




router.post("/fetchInstrumentDataByCriteria", async (req, res) => {
    try {
      const { year, departmentId, stream } = req.body;
  
      console.log("Received request body:", req.body); // Add this line for debugging
  
      if (!year || !departmentId) {
        return res.status(400).json({ error: "Year, departmentId, and stream are required in the request body" });
      }
  
      // Fetch data based on the provided criteria
      const instrumentData = await MasterInstrumentData.find({
        "department.id": departmentId,
        stream: stream,
        "sessionDetails.sessionId": year,
      });
  
      res.status(200).json({
        status:true,
        message: "Instrument Data Fetched Successfully", 
        data: instrumentData
    });
    } catch (error) {
      res.status(500).json({
        error: "An error occurred while fetching the data",
        data: error,
      });
      console.error(error);
    }
  });






module.exports = router;


