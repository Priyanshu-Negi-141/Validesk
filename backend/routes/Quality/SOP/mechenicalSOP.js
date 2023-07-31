const express = require("express")
const router = express.Router()
const ElectroTechnicalSOPData = require('../../../module/Quality/SOP/ElectroTechnicalSOP');
const MechenicalSOPData = require("../../../module/Quality/SOP/MechanicalSOP");


// Define the API endpoint to receive data
router.post('/addMechanicalSOP', (req, res) => {
    const newData = new MechenicalSOPData(req.body);
  
    newData.save()
      .then(() => {
        console.log('Data added successfully!');
        res.status(201).json({ message: 'Data added successfully!' });
      })
      .catch(err => {
        console.error('Error adding data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });

  // GET /api/sop/getElectroTechnicalSOP
router.get('/getMechanicalSOP', async (req, res) => {
    try {
      // Fetch all data from the ElectroTechnicalSOPData collection
      const etDetails = await MechenicalSOPData.find();
      res.json(etDetails);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving ElectroTechnicalSOP data' });
    }
  });

  // Delete ElectroTechnicalSOP
    router.delete('/deleteMechanicalSOP/:id', async (req, res) => {
        try {
        const deletedItem = await MechenicalSOPData.findByIdAndRemove(req.params.id);
        if (deletedItem) {
            res.json({ message: 'Item deleted successfully' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
        } catch (error) {
        res.status(500).json({ message: 'Server error' });
        }
    });

    // fetch
router.get("/mechSopNumber", (req, res) => {
  MechenicalSOPData.find({}, "sop_number")
    .then((sop) => {
      const sopNumber = sop.map((sop) => sop.sop_number);
      res.json({ sopNumber });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });
});


router.get("/mechSopNumber/:sopNumber", (req, res) => {
  const sopNumber = req.params.sopNumber;
  
  MechenicalSOPData.findOne({ sop_number: sopNumber }, "is")
    .then((sop) => {
      if (!sop) {
        return res.status(404).json({ message: "SOP not found" });
      }
      res.json({ isNumber: sop.is });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });
});




module.exports = router