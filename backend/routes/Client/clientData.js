const express = require('express');
const ClientsData = require('../../module/Client/ClientData');
const CalibrationSRFData = require('../../module/Certificate/Calibration/CalibrationSRFData');
const router = express.Router();


// Route for creating a new client
router.post('/addClients', async (req, res) => {
  try {
    const newClient = await ClientsData.create(req.body);
    res.status(201).json(newClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route for retrieving all clients
router.get('/clients', async (req, res) => {
  try {
    const clients = await ClientsData.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to fetch addresses by client name
router.get('/addresses/:clientName', async (req, res) => {
  const clientName = req.params.clientName;

  try {
    const client = await ClientsData.findOne({ client_name: clientName }, 'addresses').exec();

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    const addresses = client.addresses;
    res.json({ addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




router.get('/match', (req, res) => {
  const { name } = req.query;

  ClientsData.findOne({ client_name: { $regex: `^${name}`, $options: 'i' } })
    .then((client) => {
      if (client) {
        res.json({ clientName: client.client_name });
      } else {
        res.json({ clientName: null });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Clent Name fetch
router.get('/clientsName', (req, res) => {
  ClientsData.find({}, 'client_name')
    .then((clients) => {
      const clientNames = clients.map((client) => client.client_name);
      res.json({ clientNames });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});



// Route for retrieving a specific client by ID
router.get('/clients/:id', async (req, res) => {
  try {
    const client = await ClientsData.findById(req.params.id);
    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route for updating a specific client by ID
router.put('/clients/:id', async (req, res) => {
  try {
    const updatedClient = await ClientsData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedClient) {
      res.json(updatedClient);
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route for deleting a specific client by ID
router.delete('/clients/:id', async (req, res) => {
  try {
    const deletedClient = await ClientsData.findByIdAndDelete(req.params.id);
    if (deletedClient) {
      res.json({ message: 'Client deleted' });
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/counter", async (req, res) => {
  try {
    const aggregateResult = await CalibrationSRFData.aggregate([
      {
        $match: {
          "srf.mainCertificateNumber": { $exists: true, $ne: "" }
        }
      },
      {
        $group: {
          _id: null,
          maxCertificateNumber: { $max: "$srf.mainCertificateNumber" }
        }
      }
    ]);

    if (aggregateResult.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    const { maxCertificateNumber } = aggregateResult[0];

    return res.status(200).json({ maxCertificateNumber });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
