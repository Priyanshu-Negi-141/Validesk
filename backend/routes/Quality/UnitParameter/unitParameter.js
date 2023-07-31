const express = require("express")
const UnitParameterData = require("../../../module/Quality/UnitParameter/UnitParameterData")
const router = express.Router()


// GET route to retrieve all unit parameter data
router.get("/unitParameterDetails", async (req, res) => {
    try {
      const unitParameters = await UnitParameterData.find();
      res.json(unitParameters);
    } catch (error) {
      console.error("Error retrieving unit parameters: ", error);
      res.status(500).json({ error: "An error occurred while retrieving unit parameters" });
    }
  });
  
// POST route to create a new unit parameter
router.post("/unitParameterDetails", async (req, res) => {
    try {
      const unitParameterData = new UnitParameterData({
        unitParameterDetails: [req.body],
      });
      await unitParameterData.save();
      console.log('Data added');
      res.status(201).json({ message: "Data added successfully!" });
    } catch (error) {
      console.error("Error adding unit parameter: ", error);
      res.status(500).json({ error: "An error occurred while adding unit parameter" });
    }
  });
  
  
 // PUT route to update an existing unit parameter
router.put("/unitParameterDetails/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUnitParameterData = await UnitParameterData.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedUnitParameterData) {
      return res.status(404).json({ error: "Unit parameter not found" });
    }
    res.json(updatedUnitParameterData);
  } catch (error) {
    console.error("Error updating unit parameter: ", error);
    res.status(500).json({ error: "An error occurred while updating unit parameter" });
  }
});
  
  // DELETE route to delete a unit parameter
  router.delete("/unitParameterDetails/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const deletedUnitParameterData = await UnitParameterData.findByIdAndRemove(id);
      if (!deletedUnitParameterData) {
        return res.status(404).json({ error: "Unit parameter not found" });
      }
      res.json({ message: "Unit parameter deleted successfully" });
    } catch (error) {
      console.error("Error deleting unit parameter: ", error);
      res.status(500).json({ error: "An error occurred while deleting unit parameter" });
    }
  });

  // fetch
  router.get("/parameterName", (req, res) => {
    UnitParameterData.find({}, "unitParameterDetails.parameter_name")
      .then((parameters) => {
        const parameterNames = parameters.map((parameter) =>
          parameter.unitParameterDetails.map(
            (detail) => detail.parameter_name
          )
        );
        res.json({ parameterNames });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      });
  });



module.exports = router