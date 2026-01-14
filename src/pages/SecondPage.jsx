import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import InfoCards from "../components/InfoCards";
import SalesChart from "../components/SalesChart";

const API = "http://localhost:5000/api/link";

export default function SecondPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const activated = params.get("activated");

  // Check if user is logged in
  const jwtToken = localStorage.getItem("jwt");

  // Show invalid immediately if activated flag missing or JWT missing
  if (activated !== "true" || !jwtToken) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        ❌ Link invalid or user logged out
      </div>
    );
  }

  // Validate temp link from backend
  const validateToken = async () => {
    const res = await axios.get(`${API}/validate/${id}`);
    return res.data;
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: ["validate-token", id, jwtToken],
    queryFn: validateToken,
    enabled: !!jwtToken && activated === "true",
    retry: false,
    refetchInterval: 5000, // optional: recheck every 5 sec
  });

  // While validating
  if (isLoading) {
    return <div style={{ padding: "2rem" }}>Validating link...</div>;
  }

  // If validation failed or token invalid → show invalid message
  if (isError || !data?.valid) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        ❌ Link invalid or expired
      </div>
    );
  }

  // ✅ Render dashboard if valid
  return (
    <div style={{ padding: "2rem" }}>
      <h2>📊 Sales Dashboard</h2>
      <InfoCards />
      <div style={{ marginTop: "2rem", maxWidth: "600px" }}>
        <SalesChart />
      </div>
    </div>
  );
}
