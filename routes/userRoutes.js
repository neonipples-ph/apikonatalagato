const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/auth"); // Import authentication middleware

// Register User
router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      password,
      course,
      dateOfBirth,
      gender
    } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    let userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      course,
      dateOfBirth,
      gender,
      joinedAt: Date.now()
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message, stack: error.stack });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message, stack: error.stack });
  }
});

// Fetch All Users (Requires Authentication)
router.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await User.find().select("fullName username email course dateOfBirth gender joinedAt");
    res.json(users);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message, stack: error.stack });
  }
});

// Add User (Requires Authentication)
router.post("/users", authenticateToken, async (req, res) => {
  try {
    const { fullName, username, email, password, course, dateOfBirth, gender } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    let userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      course,
      dateOfBirth,
      gender,
      joinedAt: Date.now()
    });

    await newUser.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message, stack: error.stack });
  }
});

// Get One User by Username (Requires Authentication)
router.get("/users/:username", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message, stack: error.stack });
  }
});

// Update User (Requires Authentication)
router.put("/users/:id", authenticateToken, async (req, res) => {
  try {
    const { fullName, username, email, password, gender, course } = req.body;
    let updateFields = { fullName, username, email, gender, course };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message, stack: error.stack });
  }
});

// Delete User (Requires Authentication)
router.delete("/users/:id", authenticateToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message, stack: error.stack });
  }
});

module.exports = router;
