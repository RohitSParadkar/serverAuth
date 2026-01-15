import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axios from "axios";
import InfoCards from "../components/InfoCards";
import SalesChart from "../components/SalesChart";

const API = "http://localhost:5000/api/link";

export default function SecondPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const activated = params.get("activated");

  // 🔥 Local auth mirror (THIS IS THE FIX)
  const [auth, setAuth] = useState({
    jwt: localStorage.getItem("jwt"),
    isLogin: localStorage.getItem("isLogin")
  });

  // 🔁 Poll localStorage every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      setAuth({
        jwt: localStorage.getItem("jwt"),
        isLogin: localStorage.getItem("isLogin")
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // ❌ Always render something
  if (
    activated !== "true" ||
    auth.isLogin !== "true" ||
    !auth.jwt
  ) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        ❌ Link expired or user logged out
      </div>
    );
  }

  // 🔐 Backend validation
  const validateLink = async () => {
    const res = await axios.get(`${API}/validate/${id}`, {
      headers: { Authorization: `Bearer ${auth.jwt}` }
    });
    return res.data;
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: ["validate-link", id, auth.isLogin],
    queryFn: validateLink,
    retry: false,
    refetchInterval: 3000
  });

  if (isLoading) {
    return <div style={{ padding: "2rem" }}>Validating link...</div>;
  }

  if (isError || !data?.valid) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        ❌ Link expired or invalid
      </div>
    );
  }

  // ✅ VALID
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
