const express = require("express");

const app = express();

app.use(express.static("frontend/public"));

app.listen(1337, ()=>{
    console.log("Server is running on http://localhost:1337");
})
