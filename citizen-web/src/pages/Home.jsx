function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Civic AI</h1>
      <p style={styles.subtitle}>
        Report public issues in your city and track their resolution in real time.
      </p>

      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>Report an Issue</h3>
          <p>Spotted a pothole or broken streetlight? Let us know.</p>
        </div>

        <div style={styles.card}>
          <h3>Track Reports</h3>
          <p>Monitor the status of issues you’ve submitted.</p>
        </div>

        <div style={styles.card}>
          <h3>Smart Governance</h3>
          <p>AI powered system for faster civic management.</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: "60px",
    textAlign: "center"
  },
  title: {
    fontSize: "40px",
    marginBottom: "20px"
  },
  subtitle: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "50px"
  },
  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap"
  },
  card: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    width: "250px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  }
}

export default Home