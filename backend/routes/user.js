const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ GET all hackathons for a user
router.get("/:userId/hackathons", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("hackathonList");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.hackathonList || []);
  } catch (err) {
    console.error("❌ Error fetching hackathons:", err);
    res.status(500).json({ error: "Failed to fetch hackathons" });
  }
});

module.exports = router;
