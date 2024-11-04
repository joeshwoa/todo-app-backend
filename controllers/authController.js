const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/User");

// Register a new user with hashed password
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }
  
      // Hash the password before saving to database
      const hashedPassword = await bcrypt.hash(password, 10);
  
      user = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      await user.save();
      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
  
  // Login an existing user
  exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
  
      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

// Update user profile
exports.updateProfile = async (req, res) => {
  const { username, email, avatar } = req.body;
  try {
    let avatarURL = "";
    if (avatar) {
      const formData = new FormData();
      formData.append("image", avatar);
      const imgbbResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      avatarURL = imgbbResponse.data.data.url;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, avatarURL },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");  // Exclude password field
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
