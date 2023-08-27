const express = require("express");
const HVACMasterData = require("../../../module/Quality/MasterInstrument/HVACMaster");
const router = express.Router();

// POST route to store data in the HVACMaster collection
router.post("/addHVACMasterData", async (req, res) => {
  try {
    const hvacData = req.body; // Assuming the request body contains the data to be stored

    const newHVACData = new HVACMasterData(hvacData);
    await newHVACData.save();

    res.status(200).json({ message: "Data saved successfully in HVACMaster" });
  } catch (error) {
    res
      .status(500)
      .json({status:false, error: "An error occurred while saving the data in HVACMaster", data:null });
  }
});

// Get Stream Data and Count
router.get("/getHVACStreamCounts", async (req, res) => {
  try {
    const streamCounts = await HVACMasterData.aggregate([
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
    res.status(500).json({status:false, message: "Error retrieving stream counts" ,data:error });
  }
});

// Calibration Stream Data
router.get("/getHVACStreamDetails/:stream", async (req, res) => {
  try {
    const { stream } = req.params;
    const streamDetails = await HVACMasterData.find({ stream });
    res.json({status:true, message:"Stream Data fetched successfully",data: streamDetails});
  } catch (error) {
    res.status(500).json({status: false, message: "Error retrieving stream details", data:error });
  }
});

// Calibration Stream Data
router.get(
  "/getHVACStreamInstrumentDetails/:stream/:instrument_name",
  async (req, res) => {
    try {
      const { stream, instrument_name } = req.params;
      const streamDetails = await HVACMasterData.find({
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

router.get("/HVACInstrumentCount/:stream", async (req, res) => {
  const { stream } = req.params;

  try {
    // Perform database query to count instrument occurrences based on the stream
    const instrumentCounts = await HVACMasterData.aggregate([
      { $match: { stream } }, // Filter documents by the specified stream
      { $group: { _id: "$instrument_name", count: { $sum: 1 } } }, // Group by instrument_name and count occurrences
    ]);

    res.status(200).json({status: true, message: "Instrument Details fetched Successfully", data: instrumentCounts});
  } catch (error) {
    console.error(error);
    res.status(500).json({status: false, message: "An error occurred", data: error });
  }
});

module.exports = router;
