const express = require("express");
const path = require("path");

const app = express();

// Parse JSON bodies for API endpoints
app.use(express.json());

const publicDir = path.resolve(__dirname, "../frontend/public");
// Serve static files
app.use(express.static(publicDir));

// --- Stub API endpoints ---
app.post("/signin", (req, res) => {
  const { email, password } = req.body || {};
  res.json({
    success: true,
    message: "Signed in (stub)",
    user: {
      id: 1,
      name: "Test User",
      email: email || "test@example.com",
    },
    received: { email, password },
  });
});

app.post("/signup", (req, res) => {
  const { name, email } = req.body || {};
  res.json({
    success: true,
    message: "Account created (stub)",
    user: {
      id: 2,
      name: name || "New User",
      email: email || "new@example.com",
    },
    received: req.body,
  });
});

// SPA fallback for non-file GET requests (Express 5 compatible)
app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  // Let static files pass through; only handle "routes"
  if (path.extname(req.path)) return next();
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(1337, ()=>{
    console.log("Server is running on http://localhost:1337");
})
