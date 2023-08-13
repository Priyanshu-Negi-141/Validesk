const express = require("express");
const ClientsData = require("../../../module/Client/ClientData");
const CalibrationSRFData = require("../../../module/Certificate/Calibration/CalibrationSRFData");
const router = express.Router();
const { ObjectId } = require("mongoose");
const CalibrationMasterData = require("../../../module/Quality/MasterInstrument/CalibrationMaster");
const ElectroTechnicalSOPData = require("../../../module/Quality/SOP/ElectroTechnicalSOP");
const EmployeeDetails = require("../../../module/HRM/Employee/AddEmployee.js/EmployeeDetails");
const HVACMasterData = require("../../../module/Quality/MasterInstrument/HVACMaster");
const ThermalMasterData = require("../../../module/Quality/MasterInstrument/ThermalMaster");

// GET route to fetch company information by consent name

router.post("/srf", async (req, res) => {
  try {
    const { issussDate, client_name, address_line_1 } = req.body;

    // Find the client with matching consent_name and address_line_1
    const client = await ClientsData.findOne({
      client_name: client_name,
      "addresses.address_line_1": address_line_1,
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const currentDate = new Date(issussDate);
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const yearMonth = `${year}/${month}`;

    // Find the latest SRF document for the current year
    const latestSRF = await CalibrationSRFData.findOne({
      "srf.srfNo": { $regex: `^${year}/\\d+` },
    }).sort({ "srf.srfNo": -1 });

    let srfCounter = "001";
    if (latestSRF && latestSRF.srf[0].srfNo.startsWith(year)) {
      // Get the last srfNo for the current year
      const lastSRFNo = latestSRF.srf[0].srfNo;
      // Extract the counter part from the last srfNo
      const lastCounter = lastSRFNo.split("/")[2].split(" ")[0].trim();
      // Increment the srfCounter if the last counter is a number
      if (!isNaN(lastCounter)) {
        srfCounter = (parseInt(lastCounter) + 1).toString().padStart(3, "0");
      }
    }

    const srfNo = `${year}/${month}/${srfCounter} & ${day}/${month}/${year}`;

    const newSRF = new CalibrationSRFData({
      srf: [
        {
          issussDate,
          srfNo,
          client_name,
          clientAddress: {
            address_line_1: req.body.address_line_1,
            address_line_2: client.addresses[0].address_line_2,
            city: client.addresses[0].city,
            postal_code: client.addresses[0].postal_code,
            district: client.addresses[0].district,
            state: client.addresses[0].state,
          },
        },
      ],
    });

    // Check if the same SRF number already exists
    const existingSRF = await CalibrationSRFData.findOne({
      "srf.srfNo": srfNo,
    });

    if (existingSRF) {
      // Increment the srfCounter if the same SRF number already exists
      srfCounter = (parseInt(srfCounter) + 1).toString().padStart(3, "0");
      newSRF.srf[0].srfNo = `${year}/${month}/${srfCounter} & ${day}/${month}/${year}`;
    }

    const savedSRF = await newSRF.save();
    res.json(savedSRF);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/calibration-srf-data", async (req, res) => {
  try {
    const data = await CalibrationSRFData.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/add-instrument/:clientName/:id", async (req, res) => {
  const { clientName, id } = req.params;
  const instrumentData = req.body;

  try {
    // Find the document with the matching client name
    const srfData = await CalibrationSRFData.findOne({
      "srf.client_name": clientName,
      _id: id,
    });

    if (!srfData) {
      return res.status(404).json({ error: "Client not found" });
    }

    // Generate the certificate number
    const maxCounterDoc = await CalibrationSRFData.findOne(
      {},
      { "srf.mainCertificateNumber": 1 }
    )
      .sort({ "srf.mainCertificateNumber": -1 })
      .limit(1);
    let counter = 1;
    if (maxCounterDoc && maxCounterDoc.srf.length > 0) {
      const lastCertificateNumber =
        maxCounterDoc.srf[0].mainCertificateNumber ?? "STC/DDN/CAL/00000";
      const lastCounter = parseInt(lastCertificateNumber.split("/")[3]);
      counter = lastCounter + 1;
    }
    const formattedCounter = counter.toString().padStart(5, "0");

    const mainCertificateNumber = `STC/DDN/CAL/${formattedCounter}`;

    // Update the mainCertificateNumber and certificateNumber to be equal
    instrumentData.instrument.certificateNumber = mainCertificateNumber;
    instrumentData.mainCertificateNumber = mainCertificateNumber;

    // Add the instrument data to the instrumentDetails array
    srfData.srf[0].instrumentDetails.push(instrumentData);

    // Set the mainCertificateNumber field in the srfData document
    srfData.srf[0].mainCertificateNumber = mainCertificateNumber;

    // Save the updated document
    await srfData.save();

    return res.status(200).json({
      message: "Instrument data stored successfully",
      mainCertificateNumber,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Send DeviceData

// router.post("/update-device/:instrumentName/:id", async (req, res) => {
//   const { instrumentName, id } = req.params;
//   const deviceData = req.body; // Access the first object from the request body array

//   try {
//     // Find the document with the matching instrument name and id
//     const instrumentData = await CalibrationSRFData.findOne({
//       "srf.instrumentDetails.instrument.instrument_name": instrumentName,
//       "srf.instrumentDetails._id": id,
//     });

//     if (!instrumentData) {
//       return res.status(404).json({ error: "Instrument not found" });
//     }

//     // Ensure that the 'deviceDetails' array is initialized
//     if (!instrumentData.srf[0].instrumentDetails[0].instrument.deviceDetails) {
//       instrumentData.srf[0].instrumentDetails[0].instrument.deviceDetails = [];
//     }

//     // Add the instrument data to the 'deviceDetails' array
//     instrumentData.srf[0].instrumentDetails[0].instrument.deviceDetails.push({
//       deviceData,
//     });

//     // Save the updated document
//     await instrumentData.save();

//     res.status(200).json({ message: "Device data updated successfully" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// router.post("/update-device/:instrumentName/:id", async (req, res) => {
//   const { instrumentName, id } = req.params;
//   const deviceData = req.body;

//   try {
//     // Find the document with the matching instrument name and id
//     const instrumentData = await CalibrationSRFData.findOne({
//       "srf.instrumentDetails.instrument.instrument_name": instrumentName,
//       "srf.instrumentDetails._id": id,
//     });

//     if (!instrumentData) {
//       return res.status(404).json({ error: "Instrument not found" });
//     }

//     // Initialize 'deviceDetails' array if not present
//     if (!instrumentData.srf[0].instrumentDetails[0].instrument.deviceDetails) {
//       instrumentData.srf[0].instrumentDetails[0].instrument.deviceDetails = [];
//     }

//     // Add the instrument data to the 'deviceDetails' array
//     instrumentData.srf[0].instrumentDetails[0].instrument.deviceDetails.push({
//       ...deviceData,
//     });

//     // Save the updated document
//     await instrumentData.save();

//     res.status(200).json({ message: "Device data updated successfully" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });


// this router is submiting Fetch Device Data
router.post("/update-device/:id", async (req, res) => {
  const { id } = req.params;
  const deviceData = req.body;

  try {
    // Find the document with the matching instrument id
    const instrumentData = await CalibrationSRFData.findOne({
      "srf.instrumentDetails._id": id,
    });

    if (!instrumentData) {
      return res.status(404).json({ error: "Instrument not found" });
    }

    // Find the index of the instrument with the matching id
    const instrumentIndex = instrumentData.srf[0].instrumentDetails.findIndex(
      (instrument) => instrument._id.toString() === id
    );

    if (instrumentIndex === -1) {
      return res.status(404).json({ error: "Instrument not found" });
    }

    // Initialize 'deviceDetails' array if not present
    if (!instrumentData.srf[0].instrumentDetails[instrumentIndex].instrument.deviceDetails) {
      instrumentData.srf[0].instrumentDetails[instrumentIndex].instrument.deviceDetails = [];
    }

    // Add the instrument data to the 'deviceDetails' array
    instrumentData.srf[0].instrumentDetails[instrumentIndex].instrument.deviceDetails.push({
      ...deviceData,
    });

    // Save the updated document
    await instrumentData.save();

    res.status(200).json({ message: "Device data updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
// end's here





// Pressure Unit Data submission

router.post("/pressureUnit-data/:instrumentName/:id", async (req, res) => {
  const { instrumentName, id } = req.params;
  const pressureUnitDataArray = req.body; // Access the array of pressureUnitData objects

  try {
    // Find the document with the matching instrument name and id
    const instrumentData = await CalibrationSRFData.findOne({
      "srf.instrumentDetails.instrument.instrument_name": instrumentName,
      "srf.instrumentDetails._id": id,
    });

    if (!instrumentData) {
      return res.status(404).json({ error: "Instrument not found" });
    }

    // Ensure that the 'pressureUnitDetails' array is initialized
    if (
      !instrumentData.srf[0].instrumentDetails[0].instrument.pressureUnitDetails
    ) {
      instrumentData.srf[0].instrumentDetails[0].instrument.pressureUnitDetails =
        [];
    }

    // Add each instrument data to the 'pressureUnitDetails' array
    for (const pressureUnitData of pressureUnitDataArray) {
      instrumentData.srf[0].instrumentDetails[0].instrument.pressureUnitDetails.push(
        { pressureUnitData }
      );
    }

    // Save the updated document
    await instrumentData.save();

    res.status(200).json({ message: "Unit data updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Device Data Ended

// GET route for client_id
router.get("/:clientId", (req, res) => {
  const clientId = req.params.clientId;

  CalibrationSRFData.findById(clientId)
    .then((data) => {
      if (!data) {
        // No matching record found
        return res
          .status(404)
          .json({ message: "No table found for the provided client ID." });
      }

      res.json(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    });
});

// Date: 08-07-2023

router.get("/instrument-data/:clientName/:id", async (req, res) => {
  try {
    const { clientName, id } = req.params;

    const result = await CalibrationSRFData.findOne({
      _id: id,
      "srf.client_name": clientName,
    });

    if (result) {
      const srf = result.srf.find((srf) => srf.client_name === clientName);
      const instrumentDetails = srf ? srf.instrumentDetails : [];
      res.json(instrumentDetails);
    } else {
      res.status(404).json({ error: "Instrument data not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Client Instrument Name

router.get("/instrument-data1/:instrumentName/:id", async (req, res) => {
  try {
    const { instrumentName, id } = req.params;

    const result = await CalibrationSRFData.findOne({
      "srf.instrumentDetails._id": id,
      "srf.instrumentDetails.instrument.instrument_name": instrumentName,
    });

    if (result) {
      const instrumentDetails = result.srf[0].instrumentDetails.find(
        (instrument) => instrument._id.toString() === id
      );

      res.json(instrumentDetails);
    } else {
      res.status(404).json({ error: "Instrument data not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update Instrument Details
// router.put("/instrument-data1/:instrumentName/:id", async (req, res) => {
//   try {
//     const { instrumentName, id } = req.params;
//     const { updatedData } = req.body;

//     // Read the existing JSON data file
//     const rawData = fs.readFileSync("path/to/your/json/data/file.json");
//     const jsonData = JSON.parse(rawData);

//     // Find the index of the instrument with the given instrumentName and id
//     const instrumentIndex = jsonData.findIndex(
//       (instrument) =>
//         instrument.instrument.instrument_name === instrumentName &&
//         instrument._id === id
//     );

//     if (instrumentIndex !== -1) {
//       // Update the instrument details with the provided updatedData
//       jsonData[instrumentIndex] = updatedData;

//       // Write the updated JSON data back to the file
//       fs.writeFileSync("path/to/your/json/data/file.json", JSON.stringify(jsonData, null, 2));

//       // Return the updated data as the response
//       res.json(updatedData);
//     } else {
//       res.status(404).json({ error: "Instrument data not found" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// PUT route to update instrument details
// Function to find the matching instrument details within the nested array
async function findInstrumentAndUpdate(instrumentName, id, updatedData) {
  const srfData = await CalibrationSRFData.findOne({
    "srf.instrumentDetails._id": id,
    "srf.instrumentDetails.instrument_name": instrumentName,
  });

  if (srfData) {
    srfData.srf.forEach((srf) => {
      const instrumentIndex = srf.instrumentDetails.findIndex(
        (instrument) =>
          instrument._id.toString() === id &&
          instrument.instrument.instrument_name === instrumentName
      );

      if (instrumentIndex !== -1) {
        srf.instrumentDetails[instrumentIndex].instrument = updatedData;
      }
    });

    await srfData.save();
    return srfData;
  }

  return null;
}

// PUT route to update instrument details
// router.put("/instrument-data1/:instrumentName/:id", async (req, res) => {
//   try {
//     const { instrumentName, id } = req.params;
//     const updatedData = req.body;

//     let result = await CalibrationSRFData.findOne({
//       "srf.instrumentDetails._id": id,
//       "srf.instrumentDetails.instrument.instrument_name": instrumentName,
//     });

//     if (!result) {
//       // If the data doesn't exist, check if the required fields are provided
//       if (
//         !updatedData.certificateNumber ||
//         !updatedData.instrument_name
//       ) {
//         return res.status(400).json({
//           error: "Missing required fields to create a new document.",
//         });
//       }

//       // Create a new document with the provided data
//       result = await CalibrationSRFData.create({
//         srf: [
//           {
//             instrumentDetails: [
//               {
//                 _id: id,
//                 instrument: updatedData,
//               },
//             ],
//           },
//         ],
//       });
//     } else {
//       // Update the existing instrumentDetails
//       result.srf.forEach((srf) => {
//         const instrumentIndex = srf.instrumentDetails.findIndex(
//           (instrument) =>
//             instrument._id.toString() === id &&
//             instrument.instrument.instrument_name === instrumentName
//         );

//         if (instrumentIndex !== -1) {
//           srf.instrumentDetails[instrumentIndex].instrument = updatedData;
//         }
//       });

//       await result.save();
//     }

//     res.json(result);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// router.put("/instrument-data1/:instrumentName/:id", async (req, res) => {
//   try {
//     const { instrumentName, id } = req.params;
//     const updatedData = req.body;

//     let result = await CalibrationSRFData.findOne({
//       "srf.instrumentDetails._id": id,
//       "srf.instrumentDetails.instrument.instrument_name": instrumentName,
//     });

//     if (!result) {
//       // If the data doesn't exist, check if the required fields are provided
//       if (!updatedData.certificateNumber || !updatedData.instrument_name) {
//         return res.status(400).json({
//           error: "Missing required fields to create a new document.",
//         });
//       }

//       // Create a new document with the provided data
//       result = await CalibrationSRFData.create({
//         srf: [
//           {
//             instrumentDetails: [
//               {
//                 _id: id,
//                 instrument: {
//                   updatedData,
//                 },
//               },
//             ],
//           },
//         ],
//       });
//     } else {
//       // Iterate through the srf array to find and update the instrument
//       result.srf.forEach((srf) => {
//         const instrumentIndex = srf.instrumentDetails.findIndex(
//           (instrument) =>
//             instrument._id.toString() === id &&
//             instrument.instrument.instrument_name === instrumentName
//         );

//         if (instrumentIndex !== -1) {
//           // Merge the existing instrument data with the updatedData
//           srf.instrumentDetails[instrumentIndex].instrument = {
//             ...srf.instrumentDetails[instrumentIndex].instrument,
//             ...updatedData,
//             certificateNumber:
//               updatedData.certificateNumber ||
//               srf.instrumentDetails[instrumentIndex].instrument
//                 .certificateNumber,
//           };
//         }
//       });

//       // Save the updated document
//       try {
//         await result.save();
//       } catch (error) {
//         console.error("Error saving document:", error);
//       }
//     }

//     res.status(200).json({ message: "Update successful" }); // Send a success response
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.put("/instrument-data1/:instrumentName/:id", async (req, res) => {
  try {
    const { instrumentName, id } = req.params;
    const updatedData = req.body;

    console.log("Received instrumentName:", instrumentName);
    console.log("Received id:", id);
    console.log("Received updatedData:", updatedData);

    let result = await CalibrationSRFData.findOne({
      "srf.instrumentDetails._id": id,
      "srf.instrumentDetails.instrument.instrument_name": instrumentName,
    });

    if (!result) {
      // If the data doesn't exist, check if the required fields are provided
      if (!updatedData.certificateNumber || !updatedData.instrument_name) {
        return res.status(400).json({
          error: "Missing required fields to create a new document.",
        });
      }

      // Create a new document with the provided data
      result = await CalibrationSRFData.create({
        srf: [
          {
            instrumentDetails: [
              {
                _id: id,
                instrument: {
                  updatedData
                },
              },
            ],
          },
        ],
      });

      console.log("Created new document:", result);
    } else {
      console.log("Updating existing document");

      // Iterate through the srf array to find and update the instrument
      result.srf.forEach((srf) => {
        const instrumentIndex = srf.instrumentDetails.findIndex(
          (instrument) =>
            instrument._id.toString() === id &&
            instrument.instrument.instrument_name === instrumentName
        );

        if (instrumentIndex !== -1) {
          console.log("Found instrument to update:", instrumentIndex);

          // Merge the existing instrument data with the updatedData
          srf.instrumentDetails[instrumentIndex].instrument = {
            ...srf.instrumentDetails[instrumentIndex].instrument,
            ...updatedData,
            certificateNumber:
              updatedData.certificateNumber ||
              srf.instrumentDetails[instrumentIndex].instrument
                .certificateNumber,
          };
        }
      });

      console.log("Updated document:", result);

      // Save the updated document
      try {
        await result.save();
        console.log("Document saved successfully");
      } catch (error) {
        console.error("Error saving document:", error);
      }
    }

    res.status(200).json({ message: "Update successful" }); // Send a success response
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/instrument-data2/:instrumentName/:id", async (req, res) => {
  try {
    const { instrumentName, id } = req.params;
    const updatedData = req.body;

    console.log("Received instrumentName:", instrumentName);
    console.log("Received id:", id);
    console.log("Received updatedData:", updatedData);

    let result = await CalibrationSRFData.findOne({
      "srf.instrumentDetails._id": id,
      "srf.instrumentDetails.instrument.instrument_name": instrumentName,
    });

    if (!result) {
      // If the data doesn't exist, check if the required fields are provided
      if (!updatedData.certificateNumber || !updatedData.instrument_name) {
        return res.status(400).json({
          error: "Missing required fields to create a new document.",
        });
      }

      // Create a new document with the provided data
      result = await CalibrationSRFData.create({
        srf: [
          {
            instrumentDetails: [
              {
                _id: id,
                instrument: {
                  range: String,
                  fs: String,
                  accuracy: String,
                },
              },
            ],
          },
        ],
      });

      console.log("Created new document:", result);
    } else {
      console.log("Updating existing document");

      // Iterate through the srf array to find and update the instrument
      result.srf.forEach((srf) => {
        const instrumentIndex = srf.instrumentDetails.findIndex(
          (instrument) =>
            instrument._id.toString() === id &&
            instrument.instrument.instrument_name === instrumentName
        );

        if (instrumentIndex !== -1) {
          console.log("Found instrument to update:", instrumentIndex);

          // Merge the existing instrument data with the updatedData
          srf.instrumentDetails[instrumentIndex].instrument = {
            ...srf.instrumentDetails[instrumentIndex].instrument,
            ...updatedData,
            certificateNumber:
              updatedData.certificateNumber ||
              srf.instrumentDetails[instrumentIndex].instrument
                .certificateNumber,
          };
        }
      });

      console.log("Updated document:", result);

      // Save the updated document
      try {
        await result.save();
        console.log("Document saved successfully");
      } catch (error) {
        console.error("Error saving document:", error);
      }
    }

    res.status(200).json({ message: "Update successful" }); // Send a success response
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Adding instrument details

// router.post("/fetch-data", async (req, res) => {
//   try {
//     const { instrumentName, idNumber, selectedOption } = req.body;

//     let data;
//     if (selectedOption === "calibration") {
//       data = await CalibrationMasterData.findOne({
//         instrument_name: instrumentName,
//         id_number: idNumber,
//       });
//     } else if (selectedOption === "hvac") {
//       data = await HVACMasterData.findOne({
//         instrument_name: instrumentName,
//         id_number: idNumber,
//       });
//     } else if (selectedOption === "thermal") {
//       data = await ThermalMasterData.findOne({
//         instrument_name: instrumentName,
//         id_number: idNumber,
//       });
//     } else {
//       return res.status(400).json({ message: "Invalid option selected" });
//     }

//     if (!data) {
//       return res.status(404).json({ message: "Data not found" });
//     }

//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.get("/instrument-names/:schema", async (req, res) => {
//   try {
//     const schema = req.params.schema;

//     let InstrumentDataModel;

//     if (schema === "calibration") {
//       InstrumentDataModel = CalibrationMasterData;
//     } else if (schema === "hvac") {
//       InstrumentDataModel = HVACMasterData;
//     } else if (schema === "thermal") {
//       InstrumentDataModel = ThermalMasterData;
//     } else {
//       return res.status(400).json({ message: "Invalid schema" });
//     }

//     const instrumentNames = await InstrumentDataModel.distinct("instrument_name");

//     res.status(200).json({ instrumentNames });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.post("/fetch-data", async (req, res) => {
  try {
    const { instrumentName, idNumber, selectedOption } = req.body;

    let data;

    if (!selectedOption || !instrumentName) {
      return res.status(400).json({ message: "Invalid input" });
    }

    let InstrumentDataModel;

    if (selectedOption === "calibration") {
      InstrumentDataModel = CalibrationMasterData;
    } else if (selectedOption === "hvac") {
      InstrumentDataModel = HVACMasterData;
    } else if (selectedOption === "thermal") {
      InstrumentDataModel = ThermalMasterData;
    } else {
      return res.status(400).json({ message: "Invalid option selected" });
    }

    if (!idNumber) {
      data = await InstrumentDataModel.findOne({
        instrument_name: instrumentName,
      });
    } else {
      data = await InstrumentDataModel.findOne({
        instrument_name: instrumentName,
        id_number: idNumber,
      });
    }

    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/instrument-names/:schema", async (req, res) => {
  try {
    const schema = req.params.schema;

    let InstrumentDataModel;

    if (schema === "calibration") {
      InstrumentDataModel = CalibrationMasterData;
    } else if (schema === "hvac") {
      InstrumentDataModel = HVACMasterData;
    } else if (schema === "thermal") {
      InstrumentDataModel = ThermalMasterData;
    } else {
      return res.status(400).json({ message: "Invalid schema" });
    }

    const instrumentNames = await InstrumentDataModel.distinct(
      "instrument_name"
    );

    res.status(200).json({ instrumentNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/instrument-id/:schema/:instrumentName", async (req, res) => {
  try {
    const schema = req.params.schema;
    const instrumentName = req.params.instrumentName;

    let InstrumentDataModel;

    if (schema === "calibration") {
      InstrumentDataModel = CalibrationMasterData;
    } else if (schema === "hvac") {
      InstrumentDataModel = HVACMasterData;
    } else if (schema === "thermal") {
      InstrumentDataModel = ThermalMasterData;
    } else {
      return res.status(400).json({ message: "Invalid schema" });
    }

    const instrument = await InstrumentDataModel.findOne({
      instrument_name: instrumentName,
    });

    if (!instrument) {
      return res.status(404).json({ message: "Instrument not found" });
    }

    res.status(200).json({ instrumentId: instrument.id_number });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/instrument/:instrumentName/:instrumentId/device",
  async (req, res) => {
    const { instrumentName, instrumentId } = req.params;
    const { deviceData } = req.body;

    try {
      // Find the appropriate SRF and instrument based on the instrument name and ID
      const calibrationSRF = await CalibrationSRFData.findOne({
        "srf.instrumentDetails.instrument_name": instrumentName,
        "srf.instrumentDetails._id": instrumentId,
      });

      if (!calibrationSRF) {
        return res.status(404).json({ error: "Instrument not found" });
      }

      // Find the deviceDetails array within the instrument and push the new data
      const instrument = calibrationSRF.srf.instrumentDetails.id(instrumentId);
      if (!instrument) {
        return res.status(404).json({ error: "Instrument not found" });
      }

      instrument.deviceDetails.push(deviceData);

      // Save the updated calibration SRF data
      await calibrationSRF.save();

      res.json({ message: "Data added to deviceData successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/fetchCounter", async (req, res) => {
  try {
    // Find the document with the desired details
    const srfData = await CalibrationSRFData.findOne();

    if (!srfData) {
      return res.status(404).json({ error: "No data found" });
    }

    // Extract the mainCertificateNumber
    const mainCertificateNumber = srfData.srf[0].mainCertificateNumber;

    return res.status(200).json({ mainCertificateNumber });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST endpoint to add JSON data to deviceData

router.post("/instrument-data2/:instrumentName/:id", async (req, res) => {
  try {
    const { instrumentName, id } = req.params;
    const jsonData = req.body; // The JSON data you want to upload

    // Find the document that contains the instrument with the given id and instrument name
    const result = await CalibrationSRFData.findOne({
      "srf.instrumentDetails._id": id,
      "srf.instrumentDetails.instrument_name": instrumentName,
    });

    if (result) {
      // Find the specific instrumentDetails object within the instrumentDetails array
      const instrumentDetailsIndex = result.srf[0].instrumentDetails.findIndex(
        (instrument) => instrument._id.toString() === id
      );

      if (instrumentDetailsIndex !== -1) {
        // Add the new data to the deviceDetails array of the specific instrument
        result.srf[0].instrumentDetails[
          instrumentDetailsIndex
        ].deviceDetails.push(jsonData);

        // Save the updated document
        await result.save();

        res.json(result.srf[0].instrumentDetails[instrumentDetailsIndex]);
      } else {
        res.status(404).json({ error: "Instrument data not found" });
      }
    } else {
      res.status(404).json({ error: "Instrument data not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to handle the submission of data for a specific instrument
router.post("/submitData/:instrument_name/:_id", async (req, res) => {
  try {
    const { instrument_name, _id } = req.params;

    // Find the instrument by instrument_name and _id
    const instrument = await CalibrationSRFData.findOne({
      "instrumentDetails.instrument.instrument_name": instrument_name,
      "instrumentDetails._id": _id,
    });

    if (!instrument) {
      return res.status(404).json({ message: "Instrument not found" });
    }

    // Add the device data to the corresponding instrument
    // Make sure instrumentDetails is an array before using findIndex
    instrument.instrumentDetails = instrument.instrumentDetails || [];
    const srfIndex = instrument.instrumentDetails.findIndex(
      (item) =>
        item.instrument_name === instrument_name && item._id.toString() === _id
    );

    if (srfIndex >= 0) {
      // Add the device data to the corresponding instrument
      const { deviceData } = req.body;
      instrument.instrumentDetails[srfIndex].deviceDetails.push(deviceData);
      await instrument.save();
      return res.status(200).json({ message: "Data submitted successfully" });
    }

    return res.status(404).json({ message: "Instrument not found" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.get("/getInstrumentData/:instrumentName/:id", async (req, res) => {
  try {
    const { instrumentName, id } = req.params;
    const instrument = await CalibrationSRFData.findOne({
      "srf.instrumentDetails.instrument.instrument_name": instrumentName,
      "srf.instrumentDetails._id": id,
    });
    if (!instrument) {
      return res.status(404).json({ message: "Instrument not found" });
    } else {
      const instrumentDetails = instrument.srf[0].instrumentDetails;
      const deviceDetails = instrumentDetails[0].deviceDetails.find(
        (device) => device._id.toString() === id
      );
      if (!deviceDetails) {
        return res.status(404).json({ message: "Device details not found" });
      }

      res.json(deviceDetails);
    }
  } catch (error) {
    console.log("Error in getting data from database");
  }
});

router.post("/createDeviceData/:instrumentName/:id", async (req, res) => {
  try {
    const { instrumentName, id } = req.params;

    // Extract data from the request body
    const {
      master_type,
      stream,
      device_instrument_name, // Different instrument_name inside deviceData
      make_model,
      serial_number,
      id_number,
      range,
      least_count,
      calibration_date,
      due_date,
      cf_number,
      accuracy,
      traceability,
    } = req.body;

    // Create a new device data object with the provided device_instrument_name
    const newDeviceData = {
      deviceData: {
        master_type,
        stream,
        instrument_name: device_instrument_name, // Use device_instrument_name
        make_model,
        serial_number,
        id_number,
        range,
        least_count,
        calibration_date,
        due_date,
        cf_number,
        accuracy,
        traceability,
      },
    };

    // Find the document that matches the given instrumentName
    const documentToUpdate = await CalibrationSRFData.findOne({
      "srf.instrumentDetails.instrument.instrument_name": instrumentName,
      "srf.instrumentDetails._id": id,
    });

    if (!documentToUpdate) {
      return res.status(404).json({ message: "Instrument not found" });
    }

    // Get the instrumentDetails array
    const instrumentDetails = documentToUpdate.srf[0].instrumentDetails;

    // Find the specific instrument that matches the given id
    const instrumentToUpdate = instrumentDetails.find(
      (instrument) => instrument._id.toString() === id
    );

    if (!instrumentToUpdate) {
      return res.status(404).json({ message: "Instrument not found" });
    }

    // Ensure the deviceDetails array is defined before pushing newDeviceData
    if (!instrumentToUpdate.deviceDetails) {
      instrumentToUpdate.deviceDetails = []; // Initialize the deviceDetails array
    }

    // Add the new device data to the appropriate array
    instrumentToUpdate.deviceDetails.push(newDeviceData);

    // Save the updated document
    await documentToUpdate.save();

    res.status(201).json({ message: "Device data created successfully" });
  } catch (error) {
    console.log("Error in creating device data:", error);
    res.status(500).json({ message: "Error in creating device data" });
  }
});

// Route to store data inside deviceDetails
router.post("/store-device-data/:instrumentName/:id", async (req, res) => {
  const { instrumentName, id } = req.params;
  const { deviceData } = req.body;

  try {
    // Find the SRF by the instrument_name
    const srf = await CalibrationSRFData.findOne({
      "srf.instrumentDetails.instrument.instrument_name": instrumentName,
      "srf.instrumentDetails._id": id,
    });

    if (!srf) {
      return res.status(404).json({ message: "SRF not found" });
    }

    // Find the instrument by its instrument_name within the SRF
    const instrument = srf.srf[0].instrumentDetails.find(
      (instrument) => instrument.instrument.instrument_name === instrumentName
    );

    if (!instrument) {
      return res.status(404).json({ message: "Instrument not found" });
    }

    // Make sure the deviceDetails array exists, if not, create it
    instrument.deviceDetails = instrument.deviceDetails;

    // Push the data into the deviceDetails array
    instrument.deviceDetails.push(deviceData);

    // Save the updated SRF data to the database
    await srf.save();

    res.json({ message: "Data stored successfully" });
  } catch (error) {
    console.error("Error storing data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Storing data for certificate authorized by and created by

router.post("/store-authorized-by/:instrumentName/:id", async (req, res) => {
  const { instrumentName, id } = req.params;
  const { calibratedBy, authorizedBy } = req.body;
  try {
    // Find the SRF by the instrument_name
    const srf = await CalibrationSRFData.findOne({
      "srf.instrumentDetails.instrument.instrument_name": instrumentName,
      "srf.instrumentDetails._id": id,
    });
    if (!srf) {
      return res.status(404).json({ message: "SRF not found" });
    }

    srf.srf[0].authorizedBy.push({ calibratedBy, authorizedBy });

    // Save the updated SRF document
    await srf.save();
    return res
      .status(200)
      .json({ message: "Authorized data saved successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Fetcing data for the certificate

// Route to fetch SRF details and instrument details by sending instrumentName and id
// router.get("/fetch-instrut-details/:instrumentName/:id", async (req, res) => {
//   try {
//     const instrumentName = req.params.instrumentName;
//     const id = req.params.id;

//     // Find the SRF data that matches the given instrumentName and id
//     const srfData = await CalibrationSRFData.findOne({
//       'srf.instrumentDetails.instrument.instrument_name': instrumentName,
//       'srf.instrumentDetails._id' : id
//     });

//     if (!srfData) {
//       return res.status(404).json({ error: "SRF data not found." });
//     }

//     // Extract the relevant SRF and instrument details
//     const srfDetails = srfData.srf.find(
//       (srf) =>
//         srf.instrumentDetails.some(
//           (instrument) =>
//             instrument.instrument.instrument_name === instrumentName && instrument._id.toString() === id
//         )
//     );

//     if (!srfDetails) {
//       return res.status(404).json({ error: "Instrument details not found in SRF data." });
//     }

//     const instrumentDetails = srfDetails.instrumentDetails.find(
//       (instrument) => instrument.instrument.instrument_name === instrumentName && instrument._id.toString() === id
//     );

//     res.json({ srfDetails });
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

router.get("/fetch-instru-details/:instrumentName/:id", async (req, res) => {
  try {
    const instrumentName = req.params.instrumentName;
    const id = req.params.id;

    // Find the SRF data that matches the given instrumentName and id
    const srfData = await CalibrationSRFData.findOne({
      "srf.instrumentDetails.instrument.instrument_name": instrumentName,
      "srf.instrumentDetails._id": id,
    });

    if (!srfData || !srfData.srf || !srfData.srf[0].instrumentDetails) {
      return res.status(404).json({ error: "SRF data not found." });
    }

    // Find the specific instrument data that matches the given instrumentName and id
    const matchingInstrumentData = srfData.srf[0].instrumentDetails.find(
      (instrument) =>
        instrument.instrument.instrument_name === instrumentName &&
        instrument._id.toString() === id
    );

    if (!matchingInstrumentData) {
      return res
        .status(404)
        .json({ error: "Specific instrument data not found." });
    }

    // Replace the instrumentDetails array with the matching instrument data
    srfData.srf[0].instrumentDetails = matchingInstrumentData;

    res.json({ srfDetails: srfData.srf[0] });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get(
  "/fetchEmployeesByCalibrationEngineer/:calibrationEngineerStatus",
  async (req, res) => {
    try {
      const { calibrationEngineerStatus } = req.params;

      // Convert the string representation to a boolean value
      const isCalibrationEngineer = JSON.parse(calibrationEngineerStatus);

      // Check if isCalibrationEngineer is a valid boolean value (true or false)
      if (typeof isCalibrationEngineer !== "boolean") {
        return res.status(400).json({
          error:
            "Invalid calibrationEngineerStatus value. It should be true or false.",
        });
      }

      // Add an additional condition for branchHead to be false
      const employees = await EmployeeDetails.find({
        "employeeData.employeeRole.calibrationEngineer": isCalibrationEngineer,
        "employeeData.employeeRole.branchHead": false,
      });

      if (employees.length === 0) {
        return res.status(404).json({
          message:
            "No employees found with the provided calibrationEngineer status.",
        });
      }

      return res.status(200).json({ employees });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error." });
    }
  }
);

// multiple selection role

// Assuming you have the required middleware set up to parse the request body (e.g., bodyParser.json())

router.post("/fetchEmployeesByRole", async (req, res) => {
  try {
    const { roles } = req.body;

    if (!Array.isArray(roles)) {
      return res.status(400).json({
        error: "Invalid roles. Roles should be provided as an array.",
      });
    }

    // Construct the filter object to include only employees with all specified roles set to true
    const filter = {
      $and: roles.map((role) => ({
        [`employeeData.employeeRole.${role}`]: true,
      })),
    };

    const employees = await EmployeeDetails.find(filter);

    if (employees.length === 0) {
      return res
        .status(404)
        .json({ message: "No employees found with the provided filters." });
    }

    return res.status(200).json({ employees });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
