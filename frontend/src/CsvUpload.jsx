import { useState, useEffect } from "react";

function CsvUpload() {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [error, setError] = useState(null);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  async function handleUpload() {
    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/reports/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      setJobId(data.jobId);
      setJobStatus(null);
    } catch (err) {
      setError("Network error");
    }
  }

  // Poll job status
  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/job-status/${jobId}`
        );
        const data = await response.json();

        setJobStatus(data);

        if (data.status === "completed" || data.status === "failed") {
          clearInterval(interval);
        }
      } catch (err) {
        setError("Failed to fetch job status");
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Bulk CSV Upload</h3>

      <input type="file" accept=".csv" onChange={handleFileChange} />
      <br /><br />

      <button onClick={handleUpload}>Upload CSV</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {jobId && (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Job ID:</strong> {jobId}</p>

          {jobStatus ? (
            <div>
              <p>Status: {jobStatus.status}</p>
              <p>
                Processed {jobStatus.processed_rows} of{" "}
                {jobStatus.total_rows}
              </p>
              <p>Failed rows: {jobStatus.failed_rows}</p>
            </div>
          ) : (
            <p>Fetching job status...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CsvUpload;
