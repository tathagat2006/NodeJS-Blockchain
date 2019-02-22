const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//get blockchain
app.get("/blockchain", (req, res) => {
  res.send("Hello & Welcome");
});

//create new transaction
app.post("/transaction", (req, res) => {});

//mine a new block for us
app.get("mine", (req, res) => {});

app.listen("3000", () => {
  console.log("server started at http://localhost:3000");
});
