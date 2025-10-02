const express = require("express");
const path = require("path");
const { connectDB } = require("./config/db.js");

// Import all routes
const userRoutes = require("./routes/users.js");
const projectRoutes = require("./routes/projects.js");
const friendshipRoutes = require("./routes/friendships.js");
const activityRoutes = require("./routes/activity.js");
const searchRoutes = require("./routes/search.js");

require("dotenv").config();

connectDB();

const app = express();

app.use(express.json());

// API routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/friendships", friendshipRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/search", searchRoutes);

const publicDir = path.resolve(__dirname, "../frontend/public");
app.use(express.static(publicDir));




app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  if (path.extname(req.path)) return next();
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(1337, () => {
  console.log("Server is running on http://localhost:1337");
});
