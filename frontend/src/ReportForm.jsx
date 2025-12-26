import { useState } from "react";

function ReportForm() {
  const [formData, setFormData] = useState({
    ngoId: "",
    month: "",
    peopleHelped: "",
    eventsConducted: "",
    fundsUtilized: ""
  });

  const [status, setStatus] = useState(null);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    try {
      const response = await fetch("http://localhost:3000/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ngoId: formData.ngoId,
          month: formData.month,
          peopleHelped: Number(formData.peopleHelped),
          eventsConducted: Number(formData.eventsConducted),
          fundsUtilized: Number(formData.fundsUtilized)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({ type: "error", message: data.error });
        return;
      }

      setStatus({ type: "success", message: "Report submitted successfully" });

      // Optional reset
      setFormData({
        ngoId: "",
        month: "",
        peopleHelped: "",
        eventsConducted: "",
        fundsUtilized: ""
      });
    } catch (err) {
      setStatus({ type: "error", message: "Network error" });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>NGO ID</label><br />
        <input name="ngoId" value={formData.ngoId} onChange={handleChange} />
      </div>

      <div>
        <label>Month (YYYY-MM)</label><br />
        <input name="month" value={formData.month} onChange={handleChange} />
      </div>

      <div>
        <label>People Helped</label><br />
        <input
          name="peopleHelped"
          type="number"
          value={formData.peopleHelped}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Events Conducted</label><br />
        <input
          name="eventsConducted"
          type="number"
          value={formData.eventsConducted}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Funds Utilized</label><br />
        <input
          name="fundsUtilized"
          type="number"
          value={formData.fundsUtilized}
          onChange={handleChange}
        />
      </div>

      <button type="submit" style={{ marginTop: "1rem" }}>
        Submit Report
      </button>

      {status && (
        <p style={{ color: status.type === "error" ? "red" : "green" }}>
          {status.message}
        </p>
      )}
    </form>
  );
}

export default ReportForm;
