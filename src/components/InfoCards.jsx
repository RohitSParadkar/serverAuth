export default function InfoCards() {
  const cards = [
    { title: "Total Sales", value: "₹1,25,000" },
    { title: "Orders", value: "342" },
    { title: "Growth", value: "+12.4%" }
  ];

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      {cards.map((c) => (
        <div
          key={c.title}
          style={{
            padding: "1rem",
            borderRadius: "10px",
            background: "#f4f4f4",
            minWidth: "150px"
          }}
        >
          <h4>{c.title}</h4>
          <h2>{c.value}</h2>
        </div>
      ))}
    </div>
  );
}
