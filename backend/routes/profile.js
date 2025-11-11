const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ Save or Update Profile (linked to User)
router.post("/create", async (req, res) => {
  console.log("📩 /api/profile/create hit:", req.body);

  try {
    const { userId, header, about, experiences, education } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save profile inside the user document
    user.profile = { header, about, experiences, education };
    await user.save();

    res.status(201).json({
      message: "✅ Profile saved successfully",
      profile: user.profile,
    });
  } catch (error) {
    console.error("❌ Error saving profile:", error);
    res.status(500).json({ message: "Server error while saving profile" });
  }
});

// ✅ Fetch Profile by userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ profile: user.profile });
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
});

module.exports = router;
