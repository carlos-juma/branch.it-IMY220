const express = require("express");
const path = require("path");

const app = express();

const publicDir = path.resolve(__dirname, "../frontend/public");
app.use(express.static(publicDir));

app.get("/{*any}", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(1337, ()=>{
    console.log("Server is running on http://localhost:1337");
})
