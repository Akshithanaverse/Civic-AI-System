import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/node_modules/leaflet/dist/images/marker-icon-2x.png",
  iconUrl: "/node_modules/leaflet/dist/images/marker-icon.png",
  shadowUrl: "/node_modules/leaflet/dist/images/marker-shadow.png",
});

// Marker component to select location
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position}></Marker> : null;
}

function ReportIssue() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
  });
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setFormData({ ...formData, image: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) return alert("Please select location on map!");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("lat", position[0]);
    data.append("lng", position[1]);
    if (formData.image) data.append("image", formData.image);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/issues", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      alert(res.data.message);
      setFormData({ title: "", description: "", category: "", image: null });
      setPosition(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Report an Issue</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="title" placeholder="Issue Title" value={formData.title} onChange={handleChange} required style={styles.input} />
        <textarea name="description" placeholder="Describe the issue..." value={formData.description} onChange={handleChange} required style={styles.textarea} />
        <select name="category" value={formData.category} onChange={handleChange} required style={styles.input}>
          <option value="">Select Category</option>
          <option value="Pothole">Pothole</option>
          <option value="Streetlight">Streetlight</option>
          <option value="Garbage">Garbage</option>
          <option value="Water Leakage">Water Leakage</option>
        </select>
        <input type="file" name="image" accept="image/*" onChange={handleChange} style={styles.input} />

        <div style={{ height: "300px", marginBottom: "15px" }}>
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { padding: "60px", display: "flex", flexDirection: "column", alignItems: "center" },
  form: { width: "400px", display: "flex", flexDirection: "column", gap: "15px", background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  input: { padding: "10px", fontSize: "14px" },
  textarea: { padding: "10px", fontSize: "14px", minHeight: "80px" },
  button: { padding: "12px", background: "#0f172a", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" },
};

export default ReportIssue;