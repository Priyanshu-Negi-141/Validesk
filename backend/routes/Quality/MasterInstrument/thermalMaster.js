const express = require("express");
const ThermalMasterData = require("../../../module/Quality/MasterInstrument/ThermalMaster");
const router = express.Router();

// POST route to store data in the ThermalMaster collection
router.post("/addThermalMasterData", async (req, res) => {
  try {
    const thermalData = req.body; // Assuming the request body contains the data to be stored

    const newThermalData = new ThermalMasterData(thermalData);
    await newThermalData.save();

    res
      .status(200)
      .json({ message: "Data saved successfully in ThermalMaster" });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "An error occurred while saving the data in ThermalMaster",
      });
  }
});

// Get Stream Data and Count
router.get("/getThermalStreamCounts", async (req, res) => {
  try {
    const streamCounts = await ThermalMasterData.aggregate([
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
    res.status(500).json({status: false, message: "Error retrieving stream details", data:error });
  }
});

// Calibration Stream Data
router.get("/getThermalStreamDetails/:stream", async (req, res) => {
  try {
    const { stream } = req.params;
    const streamDetails = await ThermalMasterData.find({ stream });
    res.json({status:true, message:"Stream Data fetched successfully",data: streamDetails});
  } catch (error) {
    res.status(500).json({ status: false, error: "Error retrieving stream details", data:error });
  }
});

// Calibration Stream Data
router.get(
  "/getThermalStreamInstrumentDetails/:stream/:instrument_name",
  async (req, res) => {
    try {
      const { stream, instrument_name } = req.params;
      const streamDetails = await ThermalMasterData.find({
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

router.get("/thermalInstrumentCount/:stream", async (req, res) => {
  const { stream } = req.params;

  try {
    // Perform database query to count instrument occurrences based on the stream
    const instrumentCounts = await ThermalMasterData.aggregate([
      { $match: { stream } }, // Filter documents by the specified stream
      { $group: { _id: "$instrument_name", count: { $sum: 1 } } }, // Group by instrument_name and count occurrences
    ]);

    res.status(200).json({status: true, message: "Instrument Details fetched Successfully", data: instrumentCounts});
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: "An error Occured", data:error });
  }
});

module.exports = router;
