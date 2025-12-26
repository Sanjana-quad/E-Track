const express = require("express");
const pool = require("../db");

const router = express.Router();

router.post("/report", async (req, res) => {
  const {
    ngoId,
    month,
    peopleHelped,
    eventsConducted,
    fundsUtilized
  } = req.body;

  // Basic validation
  if (
    !ngoId ||
    !month ||
    peopleHelped == null ||
    eventsConducted == null ||
    fundsUtilized == null
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await pool.query(
      `
      INSERT INTO reports
        (ngo_id, month, people_helped, events_conducted, funds_utilized)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [ngoId, month, peopleHelped, eventsConducted, fundsUtilized]
    );

    return res.status(201).json({ message: "Report submitted successfully" });
  } catch (err) {
    // Unique constraint violation → duplicate report
    if (err.code === "23505") {
      return res
        .status(409)
        .json({ error: "Report for this NGO and month already exists" });
    }

    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
