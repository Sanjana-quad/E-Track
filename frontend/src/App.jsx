import ReportForm from "./ReportForm";
import CsvUpload from "./CsvUpload";
import Dashboard from "./Dashboard";

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>NGO Monthly Report Submission</h2>
      <ReportForm />
       <hr style={{ margin: "2rem 0" }} />
      <CsvUpload />
      <hr style={{ margin: "2rem 0" }} />
      <Dashboard />
    </div>
  );
}

export default App;
