const express = require("express");
const path = require("path");
const { connectDB } = require("./config/db.js");
const userRoutes = require("./routes/users.js");

require("dotenv").config();

connectDB();

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

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
