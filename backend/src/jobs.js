const { randomUUID } = require("crypto");
const pool = require("./db");

async function createJob() {
  const jobId = randomUUID();

  await pool.query(
    `
    INSERT INTO jobs (id, status)
    VALUES ($1, $2)
    `,
    [jobId, "pending"]
  );

  return jobId;
}

module.exports = {
  createJob
};
