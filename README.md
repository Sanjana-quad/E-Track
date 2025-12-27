# NGO Impact Reporting System

This project is a web application built to help NGOs submit monthly impact reports and help admins track aggregated impact data across NGOs.

The system supports both single report submission and bulk CSV uploads, processes large inputs asynchronously, and provides an admin dashboard to view summarized data by month.

The focus of this project is correctness, maintainability, and clear system design rather than UI polish or premature optimization.

---

## Features

### NGO Report Submission
- Submit a single monthly report with:
  - NGO ID
  - Month (YYYY-MM)
  - People Helped
  - Events Conducted
  - Funds Utilized
- Prevents duplicate submissions for the same NGO and month (idempotent)

### Bulk CSV Upload
- Upload CSV files containing multiple monthly reports
- CSV files are processed asynchronously in the background
- Returns a Job ID immediately after upload
- Supports partial failures (invalid or duplicate rows do not stop processing)

### Job Status Tracking
- Track CSV processing progress using Job ID
- View:
  - Total rows
  - Processed rows
  - Failed rows
  - Current job status

### Admin Dashboard
- View aggregated impact data for a selected month
- Displays:
  - Total NGOs reporting
  - Total people helped
  - Total events conducted
  - Total funds utilized

---

## Tech Stack

### Backend
- Node.js
- Express
- PostgreSQL
- Multer (file uploads)
- csv-parser (CSV streaming)

### Frontend
- React (Vite)
- Fetch API
- Plain CSS / inline styles (no UI libraries)

---

## System Design Overview

- REST-based architecture
- Database-enforced idempotency using unique constraints
- Background CSV processing using in-process async execution
- Polling-based job status updates
- Aggregation handled at the database level using SQL

The system avoids unnecessary abstractions, queues, or real-time protocols to keep the design simple and understandable.

---

## Database Schema

### reports table
- Stores monthly NGO reports
- Enforces uniqueness on `(ngo_id, month)` to prevent duplicates

### jobs table
- Tracks CSV upload processing state
- Stores progress counters and job status

---

## API Endpoints

### Submit Single Report
