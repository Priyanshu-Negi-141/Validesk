const express = require("express");
const CalibrationMasterData = require("../../../module/Quality/MasterInstrument/CalibrationMaster");
const router = express.Router();

// Define the API endpoint to receive data
// POST route to store data in the CalibrationMaster collection
router.post("/addCalibrationMasterData", async (req, res) => {
  try {
    const calibrationData = req.body; // Assuming the request body contains the data to be stored

    const newCalibrationData = new CalibrationMasterData(calibrationData);
    await newCalibrationData.save();
    res
      .status(200)
      .json({ message: "Data saved successfully in CalibrationMaster" });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "An error occurred while saving the data in CalibrationMaster",
      });
  }
});

// GET /api/sop/getElectroTechnicalSOP
router.get("/getCalibrationMasterData", async (req, res) => {
  try {
    // Fetch all data from the ElectroTechnicalSOPData collection
    const calibrationMasterData = await CalibrationMasterData.find();
    res.json({status:true, message: "Master Data fetched Successfully" ,data:calibrationMasterData});
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving ElectroTechnicalSOP data" });
  }
});

// Get Stream Data and Count
router.get("/getCalibrationStreamCounts", async (req, res) => {
  try {
    const streamCounts = await CalibrationMasterData.aggregate([
      {
        $group: {
          _id: "$stream",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by _id field in ascending order
      },
    ]);
    res.json({status:true,message: "Stream Data fetched successfully", data: streamCounts});
  } catch (error) {
    res.status(500).json({status:false, message: "Error retrieving stream counts", data:error });
  }
});

// Calibration Stream Data
router.get("/getCalibrationStreamDetails/:stream", async (req, res) => {
  try {
    const { stream } = req.params;
    const streamDetails = await CalibrationMasterData.find({ stream });
    res.json({status:true, message:"Stream Data fetched successfully",data: streamDetails});
  } catch (error) {
    res.status(500).json({status: false, message: "Error retrieving stream details", data:error });
  }
});

// Calibration Stream Data
router.get(
  "/getCalibrationStreamInstrumentDetails/:stream/:instrument_name",
  async (req, res) => {
    try {
      const { stream, instrument_name } = req.params;
      const streamDetails = await CalibrationMasterData.find({
        stream,
        instrument_name,
      });
      res.json({status: true,message: "Stream and Instrumentdata fetched successfully", data: streamDetails});
    } catch (error) {
      res.status(500).json({ status: false, error: "Error retrieving stream details", data:error });
    }
  }
);

//   Calibration Instrument details

router.get("/CalibrationInstrumentCount/:stream", async (req, res) => {
  const { stream } = req.params;

  try {
    // Perform database query to count instrument occurrences based on the stream
    const instrumentCounts = await CalibrationMasterData.aggregate([
      { $match: { stream } }, // Filter documents by the specified stream
      { $group: { _id: "$instrument_name", count: { $sum: 1 } } }, // Group by instrument_name and count occurrences
    ]);

    res.status(200).json({status: true, message: "Instrument Details fetched Successfully", data: instrumentCounts});
  } catch (error) {
    console.error(error);
    res.status(500).json({status: false, message: "An error occurred", data: error });
  }
});

// Delete ElectroTechnicalSOP
router.delete("/deleteElectroTechnicalSOP/:id", async (req, res) => {
  try {
    const deletedItem = await ElectroTechnicalSOPData.findByIdAndRemove(
      req.params.id
    );
    if (deletedItem) {
      res.json({ message: "Item deleted successfully" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});




// For edit purpose

router.get("/fetchMasterUniqueID/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const masterID = await CalibrationMasterData.findById(id);
    if (!masterID) {
      throw "No such record found";
    } else {
      res.json(masterID);
    }
  } catch (err) {
    console.log("Error in fetching Unique Id");
  }
});



module.exports = router;
