import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import axios from "axios";
import InfoCards from "../components/InfoCards";
import SalesChart from "../components/SalesChart";

const API = "http://localhost:5000/api/link";

export default function SecondPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const activated = params.get("activated");
  const navigate = useNavigate();

  // 🚫 Block if activated flag is not true
  useEffect(() => {
    if (activated !== "true") {
      navigate("/", { replace: true });
    }
  }, [activated, navigate]);

  const validateToken = async () => {
    const res = await axios.get(`${API}/validate/${id}`);
    return res.data;
  };

  const {
    isLoading,
    isError,
    isSuccess
  } = useQuery({
    queryKey: ["validate-token", id],
    queryFn: validateToken,
    enabled: activated === "true",
    refetchInterval: 60000, // backend recheck every 1 min
    retry: false
  });

  // ❌ Invalid / expired → redirect
  useEffect(() => {
    if (isError) {
      navigate("/", { replace: true });
    }
  }, [isError, navigate]);

  // ⏳ While validating → show NOTHING or loader
  if (isLoading || !isSuccess) {
    return (
      <div style={{ padding: "2rem" }}>
        <h3>Validating link...</h3>
      </div>
    );
  }

  // ✅ Render ONLY after validation success
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
