const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  profile: {
    header: {
      name: String,
      headline: String,
      location: String,
    },
    about: String,
    experiences: [
      {
        title: String,
        company: String,
        dates: String,
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        school: String,
        dates: String,
        field: String,
      },
    ],
  },

  // ✅ ADD THIS EXACT SCHEMA
  hackathonList: [
    {
      hackName: String,
      platform: String,
      deadline: String,
      location: String,
      prizePool: String,
      description: String,
      domains: [String],
      stages: [
        {
          name: String,
          start: String,
          end: String,
        }
      ],
      rewards: {
        winner: String,
        participant: String,
      },
    }
  ],
});

module.exports = mongoose.model("User", userSchema);
