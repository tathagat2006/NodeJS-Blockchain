const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const BlockChain = require("./blockchain");

const bitcoin = new BlockChain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//get blockchain
app.get("/blockchain", (req, res) => {
  res.send(bitcoin);
});

//create new transaction
app.post("/transaction", (req, res) => {});

//mine a new block for us
app.get("mine", (req, res) => {});

app.listen("3000", () => {
  console.log("server started at http://localhost:3000");
});
