const mongoose = require("mongoose")
const Schema = mongoose.Schema

const addressSchema = new mongoose.Schema({
    address_line_1: { type: String, required: true },
    address_line_2: { type: String, required: true },
    city: { type: String, required: true },
    postal_code: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
  });

  const consentSchema = new mongoose.Schema({
    consent_name: { type: String, required: true },
    mobile_no: { type: String, required: true },
    email: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String, required: true }
  });

  const clientSchema = new mongoose.Schema({
    client_code: { type: String, required: true },
    client_name: { type: String, required: true },
    addresses: [addressSchema],
    consent: consentSchema
  });


const ClientsData = mongoose.model("ClientFolderData", clientSchema)
module.exports=ClientsData