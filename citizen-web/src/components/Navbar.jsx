import { Link, useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Civic AI</h2>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>

        {!isLoggedIn && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}

        {isLoggedIn && (
          <>
            <Link to="/report" style={styles.link}>Report Issue</Link>
            <Link to="/my-reports" style={styles.link}>My Reports</Link>
            <button onClick={handleLogout} style={styles.logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    background: "#0f172a",
    color: "white"
  },
  logo: { margin: 0 },
  links: { display: "flex", gap: "20px", alignItems: "center" },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500"
  },
  logout: {
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontWeight: "500"
  }
};

export default Navbar;