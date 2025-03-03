import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["Supplier", "Supermarket"], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export const User = mongoose.model("User", userSchema);
