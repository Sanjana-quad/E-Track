import { useState } from "react";

function Dashboard() {
  const [month, setMonth] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchDashboard() {
    if (!month) {
      setError("Please select a month");
      return;
    }

    setError(null);
    setLoading(true);
    setData(null);

    try {
      const response = await fetch(
        `http://localhost:3000/dashboard?month=${month}`
      );
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to fetch dashboard data");
        setLoading(false);
        return;
      }

      setData(result);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Admin Dashboard</h3>

      <div>
        <label>Month:</label>{" "}
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <button onClick={fetchDashboard} style={{ marginLeft: "1rem" }}>
          View Report
        </button>
      </div>

      {loading && <p>Loading dashboard...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Month:</strong> {data.month}</p>
          <p><strong>Total NGOs Reporting:</strong> {data.total_ngos}</p>
          <p><strong>Total People Helped:</strong> {data.total_people_helped}</p>
          <p><strong>Total Events Conducted:</strong> {data.total_events_conducted}</p>
          <p><strong>Total Funds Utilized:</strong> ₹{data.total_funds_utilized}</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
