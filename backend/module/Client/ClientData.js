const mongoose = require("mongoose")
const Schema = mongoose.Schema

const addressSchema = new mongoose.Schema({
    address_line_1: { type: String},
    address_line_2: { type: String},
    city: { type: String},
    postal_code: { type: String},
    district: { type: String},
    state: { type: String},
  });

  const consentSchema = new mongoose.Schema({
    consent_name: { type: String},
    mobile_no: { type: String},
    email: { type: String},
    designation: { type: String},
    department: { type: String}
  });

  const clientSchema = new mongoose.Schema({
    client_code: { type: String},
    client_name: { type: String},
    addresses: [addressSchema],
    consent: consentSchema
  });


const ClientsData = mongoose.model("ClientFolderData", clientSchema)
module.exports=ClientsData