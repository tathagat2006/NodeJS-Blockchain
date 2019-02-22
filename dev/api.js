const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello & Welcome");
});

app.listen("3000", () => {
  console.log("server started at http://localhost:3000");
});
