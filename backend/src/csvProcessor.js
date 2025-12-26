const fs = require("fs");
const csv = require("csv-parser");
const pool = require("./db");

/*
  This function processes the CSV asynchronously.
  It is NOT awaited by the HTTP request.
*/
async function processCsv(filePath, jobId) {
  let totalRows = 0;
  let processedRows = 0;
  let failedRows = 0;

  // Mark job as processing
  await pool.query(
    `UPDATE jobs SET status = $1 WHERE id = $2`,
    ["processing", jobId]
  );

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", async (row) => {
      totalRows++;

      try {
        await pool.query(
          `
          INSERT INTO reports
            (ngo_id, month, people_helped, events_conducted, funds_utilized)
          VALUES ($1, $2, $3, $4, $5)
          `,
          [
            row.ngoId,
            row.month,
            Number(row.peopleHelped),
            Number(row.eventsConducted),
            Number(row.fundsUtilized)
          ]
        );

        processedRows++;
      } catch (err) {
        // Duplicate or validation failure
        failedRows++;
      }

      // Update progress
      await pool.query(
        `
        UPDATE jobs
        SET
          total_rows = $1,
          processed_rows = $2,
          failed_rows = $3,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        `,
        [totalRows, processedRows, failedRows, jobId]
      );
    })
    .on("end", async () => {
      await pool.query(
        `UPDATE jobs SET status = $1 WHERE id = $2`,
        ["completed", jobId]
      );

      // Optional: cleanup file
      fs.unlink(filePath, () => {});
    })
    .on("error", async () => {
      await pool.query(
        `UPDATE jobs SET status = $1 WHERE id = $2`,
        ["failed", jobId]
      );
    });
}

module.exports = { processCsv };
