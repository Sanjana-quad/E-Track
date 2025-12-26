const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/dashboard", async (req, res) => {
  const { month } = req.query;

  // Basic validation
  if (!month) {
    return res.status(400).json({ error: "month query parameter is required" });
  }

  try {
    const result = await pool.query(
      `
      SELECT
        COUNT(DISTINCT ngo_id) AS total_ngos,
        COALESCE(SUM(people_helped), 0) AS total_people_helped,
        COALESCE(SUM(events_conducted), 0) AS total_events_conducted,
        COALESCE(SUM(funds_utilized), 0) AS total_funds_utilized
      FROM reports
      WHERE month = $1
      `,
      [month]
    );

    const row = result.rows[0];

    return res.json({
      month,
      total_ngos: Number(row.total_ngos),
      total_people_helped: Number(row.total_people_helped),
      total_events_conducted: Number(row.total_events_conducted),
      total_funds_utilized: Number(row.total_funds_utilized)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
