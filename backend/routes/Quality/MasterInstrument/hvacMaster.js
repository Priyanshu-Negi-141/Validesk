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
    res.status(500).json({ error: "An error occurred while saving the data in HVACMaster" });
  }
}); 



  // Get Stream Data and Count
  router.get('/getHVACStreamCounts', async (req, res) => {
    try {
      const streamCounts = await HVACMasterData.aggregate([
        {
          $group: {
            _id: '$stream',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 } // Sort by _id field in ascending order
        }
      ]);
      res.json(streamCounts);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving stream counts' });
    }
  });

  // Calibration Stream Data
  router.get('/getHVACStreamDetails/:stream', async (req, res) => {
    try {
      const { stream } = req.params;
      const streamDetails = await HVACMasterData.find({ stream });
      res.json(streamDetails);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving stream details' });
    }
  });

  //   Calibration Instrument details


  router.get('/HVACInstrumentCount/:stream', async (req, res) => {
    const { stream } = req.params;
  
    try {
      // Perform database query to count instrument occurrences based on the stream
      const instrumentCounts = await HVACMasterData.aggregate([
        { $match: { stream } }, // Filter documents by the specified stream
        { $group: { _id: '$instrument_name', count: { $sum: 1 } } } // Group by instrument_name and count occurrences
      ]);
  
      res.status(200).json(instrumentCounts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });



module.exports = router;
