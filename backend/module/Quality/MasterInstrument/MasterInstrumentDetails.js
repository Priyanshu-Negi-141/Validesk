const mongoose = require("mongoose")
const Schema = mongoose.Schema


const instrumentDetailsSchema = new Schema({
    instrument_name: {type:String,required:true},
    make_model: {type:String,required:true},
    serial_number: {type:String,required:true},
    id_number: {type:String,required:true},
    range: {type:String,required:true},
    least_count: {type:String,required:true},
    calibration_date: {type:String,required:true},
    due_date: {type:String,required:true},
    cf_number: {type:String,required:true},
    accuracy: {type:String,required:true},
    traceability: {type:String,required:true},
})


const masterDetailsSchema = new Schema({
    master_type: {type:String,required:true},
    Department : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MasterDepartmentData',
            required : true
        },
        departmentName: {type : String, requried: true},
        streamName: {type: String}
    },
    instrumentDetails: {instrumentDetailsSchema}
})


const masterInstrumentSchema = new Schema({
    masterDetails: [masterDetailsSchema]
})


// 

const MasterInstrumentData = mongoose.model("MasterInstrumentData", masterInstrumentSchema);
// Define a post hook to update masterDetailsSchema when MasterDepartmentData changes
MasterInstrumentData.post('update', async function (doc) {
    // Assuming doc is the updated MasterInstrumentData document
    // Fetch the updated MasterDepartmentData document
    const updatedMasterDepartmentData = await mongoose.model('MasterDepartmentData').findById(doc.Department.id);
    // Update the relevant fields in masterDetailsSchema
    doc.masterDetails.forEach((masterDetail) => {
        if (masterDetail.Department.id.equals(updatedMasterDepartmentData._id)) {
            // Update fields as needed
            masterDetail.Department.departmentName = updatedMasterDepartmentData.departmentName;
            masterDetail.Department.streamName = updatedMasterDepartmentData.streamName;
            // Update other fields if necessary
        }
    });

    // Save the updated MasterInstrumentData document
    await doc.save();
});


// 

module.exports=MasterInstrumentData;