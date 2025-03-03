import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate role
    if (!["Supplier", "Supermarket"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      passwordHash: hashedPassword,
      role,
    });

    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role },
    });

  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  console.log("Login attempt:", req.body);  // Debug log

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    console.log("User not found");
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    console.log("Password incorrect");
    return res.status(400).json({ message: "Invalid credentials" });
  }

  console.log("Login successful", user.role);
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ token, role: user.role });
};


// Get All Users (Protected)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash"); // Exclude password
    res.json(users);
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
