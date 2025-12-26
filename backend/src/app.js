const express = require("express");
const reportRoutes = require("./routes/report");
const jobStatusRoutes = require("./routes/jobStatus");

const app = express();

app.use(express.json());
app.use(reportRoutes);
app.use(jobStatusRoutes);

module.exports = app;