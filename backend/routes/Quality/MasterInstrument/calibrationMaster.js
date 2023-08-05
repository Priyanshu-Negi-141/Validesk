const express = require("express");
const CalibrationMasterData = require("../../../module/Quality/MasterInstrument/CalibrationMaster");
const router = express.Router()

 
// Define the API endpoint to receive data
// POST route to store data in the CalibrationMaster collection
router.post("/addCalibrationMasterData", async (req, res) => {
    try {
      const calibrationData = req.body; // Assuming the request body contains the data to be stored
  
      const newCalibrationData = new CalibrationMasterData(calibrationData);
      await newCalibrationData.save();
  
      res.status(200).json({ message: "Data saved successfully in CalibrationMaster" });
    } catch (error) {
      res.status(500).json({ error: "An error occurred while saving the data in CalibrationMaster" });
    }
  });

  // GET /api/sop/getElectroTechnicalSOP
router.get('/getCalibrationMasterData', async (req, res) => {
    try {
      // Fetch all data from the ElectroTechnicalSOPData collection
      const calibrationMasterData = await CalibrationMasterData.find();
      res.json(calibrationMasterData);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving ElectroTechnicalSOP data' });
    }
  });

  // Get Stream Data and Count
  router.get('/getCalibrationStreamCounts', async (req, res) => {
    try {
      const streamCounts = await CalibrationMasterData.aggregate([
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
  router.get('/getCalibrationStreamDetails/:stream', async (req, res) => {
    try {
      const { stream } = req.params;
      const streamDetails = await CalibrationMasterData.find({ stream });
      res.json(streamDetails);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving stream details' });
    }
  });


//   Calibration Instrument details


  router.get('/CalibrationInstrumentCount/:stream', async (req, res) => {
    const { stream } = req.params;
  
    try {
      // Perform database query to count instrument occurrences based on the stream
      const instrumentCounts = await CalibrationMasterData.aggregate([
        { $match: { stream } }, // Filter documents by the specified stream
        { $group: { _id: '$instrument_name', count: { $sum: 1 } } } // Group by instrument_name and count occurrences
      ]);
  
      res.status(200).json(instrumentCounts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  // Delete ElectroTechnicalSOP
    router.delete('/deleteElectroTechnicalSOP/:id', async (req, res) => {
        try {
        const deletedItem = await ElectroTechnicalSOPData.findByIdAndRemove(req.params.id);
        if (deletedItem) {
            res.json({ message: 'Item deleted successfully' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
        } catch (error) {
        res.status(500).json({ message: 'Server error' });
        }
    });




module.exports = router