import axios from "axios";

const API = "http://localhost:5000/api/link";

export default function MainPage() {
  const generateLink = async () => {
    const res = await axios.post(`${API}/create`, {
      user: "user1"
    });

    const { uniqueId, activated } = res.data;

    if (activated) {
      window.open(
        `/second/${uniqueId}?activated=true`,
        "_blank"
      );
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Main Page</h2>
      <button onClick={generateLink}>
        Open Sales Dashboard
      </button>
    </div>
  );
}
