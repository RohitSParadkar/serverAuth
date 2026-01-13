import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import InfoCards from "../components/InfoCards";
import SalesChart from "../components/SalesChart";

const API = "http://localhost:5000/api/link";

export default function SecondPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const activated = params.get("activated");
  const navigate = useNavigate();

  const validateToken = async () => {
    const res = await axios.get(`${API}/validate/${id}`);
    return res.data;
  };

  const { isError } = useQuery({
    queryKey: ["validate-token", id],
    queryFn: validateToken,
    enabled: activated === "true",
    refetchInterval: 60000, // ⏱ every 1 minute
    retry: false
  });

  // ❌ Expired → redirect to main page
  if (activated !== "true" || isError) {
    navigate("/");
    return null;
  }

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
