const express = require("express");
const router = express.Router();

router.get("/generate-application-url", async (req, res) => {
    try {
      const fileName = `/uploads/application/${Date.now()}`;
      const contentType = "application/vnd.android.package-archive";
  
      const url = await putObject(fileName, contentType);
  
      const response = {
        status: true,
        message: "Upload URL generated successfully",
        data: [
          {
            img_path: fileName,
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