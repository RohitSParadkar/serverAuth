import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const API = "http://localhost:5000/api/link";

export default function MainPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("jwt")) navigate("/login");
  }, [navigate]);

  const generateLink = async () => {
    const jwtToken = localStorage.getItem("jwt");
    if (!jwtToken) return alert("Login first");

    try {
      const res = await axios.post(`${API}/create`, {}, { headers: { Authorization: `Bearer ${jwtToken}` } });
      const { uniqueId, activated } = res.data;
      if (activated) window.open(`/second/${uniqueId}?activated=true`, "_blank");
    } catch (err) {
      alert(err.response?.data?.message || "Error generating link");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Main Page</h2>
      <button onClick={generateLink}>Open Sales Dashboard</button>
      <button onClick={logout} style={{ marginLeft: "1rem" }}>Logout</button>
    </div>
  );
}
