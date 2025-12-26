const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/job-status/:jobId", async (req, res) => {
  const { jobId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        status,
        total_rows,
        processed_rows,
        failed_rows
      FROM jobs
      WHERE id = $1
      `,
      [jobId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
