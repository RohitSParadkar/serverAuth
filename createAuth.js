import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/temp_links";
await mongoose.connect(MONGO_URI);
console.log("MongoDB connected");

const username = "user1";          // <-- TYPE YOUR USERNAME
const plainPassword = "Password@123"; // <-- TYPE YOUR PASSWORD

const hashedPassword = await bcrypt.hash(plainPassword, 10);
const existing = await User.findOne({ username });

if (existing) {
  existing.password = hashedPassword;
  await existing.save();
  console.log("Password updated for user:", username);
} else {
  const user = await User.create({ username, password: hashedPassword });
  console.log("User created:", user.username);
}

process.exit();
