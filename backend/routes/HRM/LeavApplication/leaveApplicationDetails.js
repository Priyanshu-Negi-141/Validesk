const express = require('express')
const fetchEmployee = require('../../../middleware/fetchEmployee');
const EmployeeDetails = require('../../../module/HRM/Employee/AddEmployee/EmployeeDetails');
const LeaveApplicationDetails = require('../../../module/HRM/LeaveApplicationData/LeaveApplicationDetails');
const router = express.Router()


router.post("/employeeLeaveApplication", fetchEmployee, async(req, res) => {
    try {
        const { reason, startDate, endDate, numOfDays, comments } = req.body;
        const employee = await EmployeeDetails.findById(req.employeeData.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
          }
          const employeeData = employee.employeeData[0];
          const leaveData = new LeaveApplicationDetails({
            reason: reason,
            startDate: startDate,
            endDate: endDate,
            numOfDays: numOfDays,
            comments: comments,
            Employee: {
                id: employee.id,
                fName: employeeData.fName,
                lName: employeeData.lName,
                department: employeeData.department,
                mobile_number: employeeData.mobile_number,
                email: employeeData.email,
              }
          })
          const saveLeaveData = await leaveData.save()
          res.json(saveLeaveData)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }
})

router.put("/approveLeave/:applicationId", fetchEmployee, async (req, res) => {
    try {
      const applicationId = req.params.applicationId;
      const { approvalStatus } = req.body;
  
      // Fetch the leave application by its ID
      const leaveApplication = await LeaveApplicationDetails.findById(applicationId);
      
      if (!leaveApplication) {
        return res.status(404).json({ error: 'Leave application not found' });
      }
  
      // Update the HOD approval status
      leaveApplication.hodApprovalStatus = approvalStatus;
      
      // Save the updated document
      const updatedApplication = await leaveApplication.save();
  
      res.json(updatedApplication);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error occurred");
    }
  });
  


module.exports = router