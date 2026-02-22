import { useEffect, useState } from "react";
import { getMyReports } from "../services/api";

function MyReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await getMyReports();
      setReports(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>My Reports</h2>

      {reports.length === 0 ? (
        <p>No reports submitted yet.</p>
      ) : (
        reports.map((report) => (
          <div key={report._id} style={styles.card}>
            <h3>{report.title}</h3>
            <p>{report.description}</p>
            <p><strong>Status:</strong> {report.status}</p>

            {report.images?.length > 0 && (
              <img
                src={report.images[0]}
                alt="issue"
                style={styles.image}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { padding: "40px" },
  card: {
    border: "1px solid #ddd",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px"
  },
  image: {
    width: "200px",
    marginTop: "10px",
    borderRadius: "6px"
  }
};

export default MyReports;