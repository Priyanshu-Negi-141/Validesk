const express = require("express");
const fetchEmployee = require("../../middleware/fetchEmployee");
const SessionData = require("../../module/Session/Session");
const EmployeeDetails = require("../../module/HRM/Employee/AddEmployee/EmployeeDetails");
const {body, validationResult} = require('express-validator')
const router = express.Router();
const moment = require('moment'); // For date manipulation


router.post("/addSession", fetchEmployee, 
[
    body('session')
        .exists().withMessage('Session is required')
        .notEmpty().withMessage('Session cannot be empty')
        .isNumeric().withMessage('Session must be a number')
        .isLength({ min: 4, max: 4 }).withMessage('Session must have exactly 4 digits')
], async (req, res) => {
  const employee = await EmployeeDetails.findById(req.employeeData.id);
  if (!employee) {
    return res
      .status(404)
      .json({ status: false, message: "Employee not found", data: null });
  } else {
    try {
        const sessionData = req.body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
          });
        }
        const newSession = new SessionData(sessionData)
        const saveSession = await newSession.save()
        res.status(200).json({
            status: true,
            message: "Data Saved Successfully",
            data: saveSession
        })
    } catch (error) {
        console.log('err', error)
        return res
        .status(400)
        .json({ status: false, message: "Something Went Wrong", data: null });
    }
  }
});



// Get session data by ID
router.get("/getSession", async (req, res) => {
    try {
      const session = await SessionData.find();
      if (!session) {
        return res.status(404).json({ status: false, message: "Session not found", data: null });
      }
      res.status(200).json({ status: true, message: "Session retrieved successfully", data: session });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Internal Server Error", data: null });
    }
  });


//   64fdf0f2f61050bc3a66fd0c

// Get session data by ID
router.get("/getSession/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const session = await SessionData.findById(sessionId);
      if (!session) {
        return res.status(404).json({ status: false, message: "Session not found", data: null });
      }
      res.status(200).json({ status: true, message: "Session retrieved successfully", data: session });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Internal Server Error", data: null });
    }
  });


  // Update session data by ID
router.put("/updateSession/:sessionId", fetchEmployee, [
    body('session')
        .exists().withMessage('Session is required')
        .notEmpty().withMessage('Session cannot be empty')
        .isNumeric().withMessage('Session must be a number')
        .isLength({ min: 4, max: 4 }).withMessage('Session must have exactly 4 digits')
], async (req, res) => {
  const sessionId = req.params.sessionId;
  const employee = await EmployeeDetails.findById(req.employeeData.id);
  if (!employee) {
    return res.status(404).json({ status: false, message: "Employee not found", data: null });
  } else {
    try {
        const sessionData = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
          });
        }
        const updatedSession = await SessionData.findByIdAndUpdate(sessionId, sessionData, { new: true });
        if (!updatedSession) {
          return res.status(404).json({ status: false, message: "Session not found", data: null });
        }
        res.status(200).json({
            status: true,
            message: "Data Updated Successfully",
            data: updatedSession
        });
    } catch (error) {
        console.log('err', error);
        return res.status(400).json({ status: false, message: "Something Went Wrong", data: null });
    }
  }
});

  




// Define the route to fetch the appropriate session
router.get('/fetchSessionByDate', async (req, res) => {
    try {
      // Get the current date
      const currentDate = moment();
  
      // Fetch all sessions from the database
      const sessions = await SessionData.find();
  
      // Iterate through the sessions and find the one that matches the current date
      let selectedSession = null;
      sessions.forEach((session) => {
        const startDate = moment(session.startDate);
        const endDate = moment(session.endDate);
  
        // Check if the current date is within the session's date range
        if (currentDate.isBetween(startDate, endDate, null, '[]')) {
          selectedSession = {
            _id: session._id,
            session: session.session,
          };
        }
      });
  
      if (!selectedSession) {
        return res.status(404).json({
          status: false,
          message: 'No matching session found for the current date',
          data: null,
        });
      }
  
      res.status(200).json({
        status: true,
        message: 'Session retrieved successfully',
        data: selectedSession,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: 'Internal Server Error',
        data: null,
      });
    }
  });
  

module.exports = router;
