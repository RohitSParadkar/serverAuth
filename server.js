import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

import User from "./models/User.js";
import TempLink from "./models/TempLink.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;
const MONGO_URI = "mongodb://127.0.0.1:27017/temp_links";
const JWT_SECRET = "my_super_secret_key";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// --- LOGIN ---
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "Invalid username" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ username, type: "auth" }, JWT_SECRET, { expiresIn: "15m" });
  res.json({ username, token });
});

// --- CREATE TEMP LINK ---
app.post("/api/link/create", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Missing token" });

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const tempToken = jwt.sign({ username: decoded.username, type: "temp_link" }, JWT_SECRET, { expiresIn: "1m" });

    await TempLink.create({ token: tempToken, createdBy: decoded.username });
    res.json({ uniqueId: tempToken, activated: true });
  } catch {
    res.status(401).json({ message: "Invalid login token" });
  }
});

// --- VALIDATE TEMP LINK ---
app.get("/api/link/validate/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, JWT_SECRET);
    if (decoded.type !== "temp_link") return res.status(403).json({ message: "Invalid link type" });

    res.json({ valid: true });
  } catch {
    res.status(401).json({ message: "Link expired or invalid" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
