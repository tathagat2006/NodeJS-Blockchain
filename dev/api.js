const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const BlockChain = require("./blockchain");
const uuid = require("uuid/v1");
const bitcoin = new BlockChain();

const nodeAddress = uuid()
  .split("-")
  .join("");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//get blockchain
app.get("/blockchain", (req, res) => {
  res.send(bitcoin);
});

//create new transaction
app.post("/transaction", (req, res) => {
  const blockIndex = bitcoin.crateNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  res.json({ note: `Transaction will be added to block ${blockIndex}.` });
});

//mine a new block for us
app.get("/mine", (req, res) => {
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock["index"] + 1
  };
  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );
  bitcoin.crateNewTransaction(12.5, "00", nodeAddress); // mining reward
  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
  res.json({
    note: "New block mined successfully",
    block: newBlock
  });
});

app.listen("3000", () => {
  console.log("server started at http://localhost:3000");
});
