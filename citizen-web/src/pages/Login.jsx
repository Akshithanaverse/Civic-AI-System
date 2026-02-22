import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(email, password);
      localStorage.setItem("token", res.data.token); // store JWT
      setIsLoggedIn(true);
      alert("Login successful!");
      navigate("/report"); // go to report page
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Citizen Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { padding: "60px", display: "flex", flexDirection: "column", alignItems: "center" },
  form: { width: "300px", display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "10px", fontSize: "14px" },
  button: { padding: "12px", background: "#0f172a", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" },
};

export default Login;