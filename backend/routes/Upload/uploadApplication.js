const express = require("express");
const ApplicationData = require("../../module/Upload/Application");
const { putObject, getObjectURL } = require("../../s3-bucket/bucket");
const router = express.Router(); 

router.get("/generate-application-url", async (req, res) => {
    try {
      const fileName = `/uploads/application/starCalibration-${Date.now()}.apk`;
      const contentType = "application/vnd.android.package-archive";
      const url = await putObject(fileName, contentType);
      const appData = await ApplicationData({
        applicationPath: fileName
      })
      
      await appData.save()
      const response = {
        status: true,
        message: "Upload URL generated successfully",
        data: [
          {
            apk_path: fileName,
            url: url,
          },
        ],
      };
  
      res.json(response);
    } catch (error) {
      console.error("Error generating upload URL:", error);
      const response = {
        status: false,
        message: "Unable to generate upload URL",
        data: [],
      };
      res.status(500).json(response);
    }
  });


  // router.get("/generate-application-url-1", async (req, res) => {
  //   try {
  //     const applicationPaths = await ApplicationData.find({}, 'applicationPath');
  
  //     // Extract the applicationPath values from the array
  //     const fileNames = applicationPaths.map((doc) => doc.applicationPath);
  
  //     // Assuming you want to work with the first fileName (you can change this as needed)
  //     const fileName = fileNames[0];
  
  //     const url = await getObjectURL(fileName);
  
  //     const response = {
  //       status: true,
  //       message: "Application URL generated successfully",
  //       data: [
  //         {
  //           apk_path: fileName,
  //           url: url,
  //         },
  //       ],
  //     };
  
  //     res.json(response);
  //   } catch (error) {
  //     console.error("Error generating upload URL:", error);
  //     const response = {
  //       status: false,
  //       message: "Unable to generate upload URL",
  //       data: [],
  //     };
  //     res.status(500).json(response);
  //   }
  // });

  
  
  // router.get("/generate-application-url-1", async (req, res) => {
  //   try {
  //     // Sort the documents by createdAt field in descending order to get the latest one
  //     const latestApplicationPath = await ApplicationData.findOne({}, 'applicationPath')
  //       .sort({ createdAt: -1 })
  //       .lean(); // Use lean() to get a plain JavaScript object
  //     if (!latestApplicationPath) {
  //       const response = {
  //         status: false,
  //         message: "No applicationPath found",
  //         data: [],
  //       };
  //       return res.status(404).json(response);
  //     }
  //     const fileName = latestApplicationPath.applicationPath;
  //     const url = await getObjectURL(fileName);
  //     const response = {
  //       status: true,
  //       message: "Application URL generated successfully",
  //       data: [
  //         {
  //           apk_path: fileName,
  //           url: url,
  //         },
  //       ],
  //     };
  
  //     res.json(response);
  //   } catch (error) {
  //     console.error("Error generating upload URL:", error);
  //     const response = {
  //       status: false,
  //       message: "Unable to generate upload URL",
  //       data: [],
  //     };
  //     res.status(500).json(response);
  //   }
  // });
  

  router.get("/generate-application-url-1", async (req, res) => {
    try {
      // Calculate the start of today
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
  
      // Query to find the latest applicationPath for today's date
      const latestApplicationPathToday = await ApplicationData.findOne({
        date: { $gte: startOfToday },
      }, 'applicationPath')
        .sort({ date: -1 })
        .lean();
  
      if (latestApplicationPathToday) {
        const fileNameToday = latestApplicationPathToday.applicationPath;
        const urlToday = await getObjectURL(fileNameToday);
        const responseToday = {
          status: true,
          message: "Application URL for today's date generated successfully",
          data: [
            {
              apk_path: fileNameToday,
              url: urlToday,
            },
          ],
        };
  
        return res.json(responseToday);
      }
  
      // If today's date is not found, fall back to the most recent date
      const latestApplicationPath = await ApplicationData.findOne({}, 'applicationPath')
        .sort({ date: -1 })
        .lean();
  
      if (!latestApplicationPath) {
        const response = {
          status: false,
          message: "No applicationPath found",
          data: [],
        };
        return res.status(404).json(response);
      }
  
      const fileName = latestApplicationPath.applicationPath;
      const url = await getObjectURL(fileName);
      const response = {
        status: true,
        message: "Application URL for the most recent date generated successfully",
        data: [
          {
            apk_path: fileName,
            url: url,
          },
        ],
      };
  
      res.json(response);
    } catch (error) {
      console.error("Error generating upload URL:", error);
      const response = {
        status: false,
        message: "Unable to generate upload URL",
        data: [],
      };
      res.status(500).json(response);
    }
  });
  
  
  
  




  module.exports = router;