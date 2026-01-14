import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import SecondPage from "./pages/SecondPage";

function Protected({ children }) {
  const token = localStorage.getItem("jwt");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* MainPage is initial page, but protected */}
      <Route
        path="/"
        element={
          <Protected>
            <MainPage />
          </Protected>
        }
      />

      <Route
        path="/main"
        element={
          <Protected>
            <MainPage />
          </Protected>
        }
      />

      <Route
        path="/second/:id"
        element={
          <Protected>
            <SecondPage />
          </Protected>
        }
      />
    </Routes>
  );
}
