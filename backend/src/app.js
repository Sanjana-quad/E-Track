const express = require("express");
const cors = require("cors");

const reportRoutes = require("./routes/report");
const jobStatusRoutes = require("./routes/jobStatus");
const reportUploadRoutes = require("./routes/reportUpload");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(cors());
app.use(express.json());
app.use(reportRoutes);
app.use(jobStatusRoutes);
app.use(reportUploadRoutes);
app.use(dashboardRoutes);

module.exports = app;