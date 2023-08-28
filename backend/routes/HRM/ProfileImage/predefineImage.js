const express = require("express");
const router = express.Router();
const multer = require("multer");
const fetchEmployee = require("../../../middleware/fetchEmployee");
const EmployeeDetails = require("../../../module/HRM/Employee/AddEmployee/EmployeeDetails");
const PredefineImages = require("../../../module/HRM/ProfileImage/PredefineImages");

const storage = multer.memoryStorage();
const upload = multer({ storage });


// router.put("/add-predefined-images", fetchEmployee, async(req,res) => {
//     try {
//         const employee = await EmployeeDetails.findById(req.employeeData.id)
//         if (!employee) {
//             return res
//               .status(404)
//               .json({ status: false, message: "Employee not found", data: null });
//         }
//         const employeeData = employee.employeeData[0];
//         const { imageUrl } = req.body;
//         const imgStore = new PredefineImages({
//             Employee: {
//                 id: employee.id,
//                 fName: employeeData.fName,
//                 lName: employeeData.lName,
//                 department: employeeData.department,
//                 designation: employeeData.designation
//               },
//               imageUrl: imageUrl
//         })
//         const predefinedImage = await imgStore.save();
//         res.status(200).json({status:true, message: "Predefined image associated with employee.", data:predefinedImage});

//     } catch (error) {
//         console.error(error);
//     res.status(500).json({status:false, message: "An error occurred.", data: error });
//     }
// })


router.put("/add-predefined-images", fetchEmployee, async (req, res) => {
    try {
      const employee = await EmployeeDetails.findById(req.employeeData.id);
      if (!employee) {
        return res
          .status(404)
          .json({ status: false, message: "Employee not found", data: null });
      }
      const employeeData = employee.employeeData[0];
      const { imageUrl } = req.body;
  
      // Check if predefined image already exists for the employee
      const existingImage = await PredefineImages.findOne({
        "Employee.id": employee.id,
      });
  
      let predefinedImage;
  
      if (existingImage) {
        // Update the existing image
        existingImage.imageUrl = imageUrl;
        predefinedImage = await existingImage.save();
      } else {
        // Create a new predefined image entry
        const imgStore = new PredefineImages({
          Employee: {
            id: employee.id,
            fName: employeeData.fName,
            lName: employeeData.lName,
            department: employeeData.department,
            designation: employeeData.designation,
          },
          imageUrl: imageUrl,
        });
        predefinedImage = await imgStore.save();
      }
  
      res
        .status(200)
        .json({
          status: true,
          message: "Predefined image associated with employee.",
          data: predefinedImage,
        });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: false, message: "An error occurred.", data: error });
    }
  });


//   router.get('/fetch-predefined-image', async (req, res) => {
//     try {
//       const imageData = await PredefineImages.findOne(); // Fetch the first entry
//       if (!imageData) {
//         return res.status(404).json({ status: false, message: 'Image data not found', data: null });
//       }
//       res.status(200).json({ status: true, message: 'Image data fetched successfully', data: imageData });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ status: false, message: 'An error occurred', data: error });
//     }
//   });


router.get('/fetch-predefined-image', fetchEmployee, async (req, res) => {
    try {
      const employeeID = req.employeeData.id;
      console.log(employeeID)
  
      const imageData = await PredefineImages.findOne({
        'Employee.id': employeeID,
      });
  
      if (!imageData) {
        return res.status(404).json({ status: false, message: 'Image data not found', data: null });
      }
  
      res.status(200).json({ status: true, message: 'Image data fetched successfully', data: imageData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: 'An error occurred', data: error });
    }
  });
   

router.get("/employee-predefined-images/:employeeId", async (req, res) => {
    try {
        const employeeId = req.params.employeeId;

        const predefinedImages = await PredefineImages.find({
            "Employee.id": employeeId,
        });

        res.status(200).json({status: true,message: 'Image data fetched successfully',data: predefinedImages});
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "An error occurred.", data: error });
    }
});


router.put("/update-predefined-image/:imageId", async (req, res) => {
    try {
        const imageId = req.params.imageId;
        const { imageUrl } = req.body;

        const updatedImage = await PredefineImages.findByIdAndUpdate(
            imageId,
            { imageUrl },
            { new: true }
        );

        if (!updatedImage) {
            return res
                .status(404)
                .json({ status: false, message: "Predefined image not found", data: null });
        }

        res.status(200).json({ status: true, message: "Predefined image updated.", data: updatedImage });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "An error occurred.", data: error });
    }
});


router.delete("/delete-predefined-image/:imageId", async (req, res) => {
    try {
        const imageId = req.params.imageId;

        const deletedImage = await PredefineImages.findByIdAndDelete(imageId);

        if (!deletedImage) {
            return res
                .status(404)
                .json({ status: false, message: "Predefined image not found", data: null });
        }

        res.status(200).json({ status: true, message: "Predefined image deleted.", data: deletedImage });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "An error occurred.", data: error });
    }
});





module.exports = router;