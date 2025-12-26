const express = require("express");
const multer = require("multer");
const { createJob } = require("../jobs");
const { processCsv } = require("../csvProcessor");

const router = express.Router();

/*
  Storage decision:
  - Disk storage (simple)
  - Unique filename to avoid collisions
*/
const upload = multer({
  dest: "uploads/"
});

router.post("/reports/upload", upload.single("file"), async (req, res) => {
  // Step 1: ensure file exists
  if (!req.file) {
    return res.status(400).json({ error: "CSV file is required" });
  }

  try {
    // Step 2: create a job
    const jobId = await createJob();

    /*
      IMPORTANT:
      We are intentionally NOT processing the file here.
      That comes in the next step.
    */

    return res.status(202).json({
      jobId,
      message: "File uploaded successfully. Processing started."
    });

    setImmediate(() => {
      processCsv(req.file.path, jobId);
    });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
