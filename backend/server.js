const express = require("express");
//require("dotenv").config({ path: "./.env" });
require("dotenv").config();  
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile"); // ✅ Imported
const summarizeRoute = require("./routes/summarize");
console.log("Loaded Key:", process.env.OPENAI_API_KEY ? "✅ Found" : "❌ Not found");

const app = express();
// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes); // 👈 Add this line!
app.use("/api/summarize", summarizeRoute); 
app.use("/api/user", require("./routes/user"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
