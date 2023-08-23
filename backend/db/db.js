require('dotenv').config()
const mongoose = require("mongoose");
const EmployeeDetails = require('../module/HRM/Employee/AddEmployee/EmployeeDetails');
const mongoDBURL = process.env.MONGO_URL

// Connect to DB
const connectToMongo = mongoose.connect(mongoDBURL, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
})
.then(() => {
    console.log(`MongoDB Connected at ${mongoDBURL}`)
    })
.catch((err) => {
    throw new Error('Could not connect to MongoDB')
    });


    // const updateEmployeeRecords = async () => {
    //     try {
    //       const employees = await EmployeeDetails.find();
      
    //       for (const employee of employees) {
    //         if (!employee.employeeData[0].user_pin) {
    //           // Set a default user_pin value here if needed
    //           employee.employeeData[0].user_pin = 'default_pin';
      
    //           await employee.save();
    //           console.log(`Updated user_pin for employee with ID: ${employee._id}`);
    //         }
    //       }
      
    //       console.log('All records updated successfully.');
    //     } catch (error) {
    //       console.error('Error updating records:', error);
    //     } finally {
    //       mongoose.disconnect();
    //     }
    //   };
      
    //   updateEmployeeRecords();
      
      
    
      
      


module.exports = async () => await connectToMongo;