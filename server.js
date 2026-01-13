const express = require("express");
const cors = require("cors");
require("./mongo/db");

const linkRoutes = require("./routes/linkRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/link", linkRoutes);

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
