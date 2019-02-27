const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const BlockChain = require("./blockchain");
const uuid = require("uuid/v1");
const farmbuddy = new BlockChain();
const port = process.argv[2];
const rp = require("request-promise");

const nodeAddress = uuid()
  .split("-")
  .join("");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//get blockchain
app.get("/blockchain", (req, res) => {
  res.send(farmbuddy);
});

// create a new transaction
app.post("/transaction", function(req, res) {
  const newTransaction = req.body;
  const blockIndex = farmbuddy.addTransactionToPendingTransactions(
    newTransaction
  );
  res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

// broadcast transaction
app.post("/transaction/broadcast", function(req, res) {
  const newTransaction = farmbuddy.crateNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  farmbuddy.addTransactionToPendingTransactions(newTransaction);

  const requestPromises = [];
  farmbuddy.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + "/transaction",
      method: "POST",
      body: newTransaction,
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then(data => {
    res.json({ note: "Transaction created and broadcast successfully." });
  });
});

//mine a new block for us
app.get("/mine", (req, res) => {
  const lastBlock = farmbuddy.getLastBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: farmbuddy.pendingTransactions,
    index: lastBlock["index"] + 1
  };
  const nonce = farmbuddy.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = farmbuddy.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );
  // farmbuddy.crateNewTransaction(12.5, "00", nodeAddress); // mining reward
  const newBlock = farmbuddy.createNewBlock(
    nonce,
    previousBlockHash,
    blockHash
  );
  const requestPromises = [];
  farmbuddy.networkNodes.forEach(newNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + "/receive-new-block",
      method: "POST",
      body: { newBlock: newBlock },
      json: true
    };
    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
    .then(data => {
      const requestOptions = {
        uri: farmbuddy.currentNodeUrl + "/transaction/broadcast",
        method: "POST",
        body: {
          amount: 12.5,
          sender: "00",
          recipient: nodeAddress
        },
        json: true
      };
      return rp(requestOptions);
    })
    .then(data => {
      res.json({
        note: "New block mined & broadcasted successfully",
        block: newBlock
      });
    });
});

// receive new block
app.post("/receive-new-block", function(req, res) {
  const newBlock = req.body.newBlock;
  const lastBlock = farmbuddy.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock["index"] + 1 === newBlock["index"];

  if (correctHash && correctIndex) {
    farmbuddy.chain.push(newBlock);
    farmbuddy.pendingTransactions = [];
    res.json({
      note: "New block received and accepted.",
      newBlock: newBlock
    });
  } else {
    res.json({
      note: "New block rejected.",
      newBlock: newBlock
    });
  }
});

// register a node and broadcast it the network
app.post("/register-and-broadcast-node", function(req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (farmbuddy.networkNodes.indexOf(newNodeUrl) == -1)
    farmbuddy.networkNodes.push(newNodeUrl);

  const regNodesPromises = [];
  farmbuddy.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + "/register-node",
      method: "POST",
      body: { newNodeUrl: newNodeUrl },
      json: true
    };

    regNodesPromises.push(rp(requestOptions));
  });

  Promise.all(regNodesPromises)
    .then(data => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNodes: [...farmbuddy.networkNodes, farmbuddy.currentNodeUrl]
        },
        json: true
      };

      return rp(bulkRegisterOptions);
    })
    .then(data => {
      res.json({ note: "New node registered with network successfully." });
    });
});

// register a node with the network
app.post("/register-node", function(req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent =
    farmbuddy.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = farmbuddy.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyPresent && notCurrentNode)
    farmbuddy.networkNodes.push(newNodeUrl);
  res.json({ note: "New node registered successfully." });
});

// register multiple nodes at once
app.post("/register-nodes-bulk", function(req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotAlreadyPresent =
      farmbuddy.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = farmbuddy.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode)
      farmbuddy.networkNodes.push(networkNodeUrl);
  });

  res.json({ note: "Bulk registration successful." });
});

// consensus
app.get("/consensus", function(req, res) {
  const requestPromises = [];
  farmbuddy.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + "/blockchain",
      method: "GET",
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then(blockchains => {
    const currentChainLength = farmbuddy.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach(blockchain => {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });

    if (
      !newLongestChain ||
      (newLongestChain && !farmbuddy.chainIsValid(newLongestChain))
    ) {
      res.json({
        note: "Current chain has not been replaced.",
        chain: farmbuddy.chain
      });
    } else {
      farmbuddy.chain = newLongestChain;
      farmbuddy.pendingTransactions = newPendingTransactions;
      res.json({
        note: "This chain has been replaced.",
        chain: farmbuddy.chain
      });
    }
  });
});

app.post("/getblock", (req, res) => {
  const id = req.body.id;
  const desiredBlock = farmbuddy.getBlock(id);
  // var parsedBlock = JSON.parse(desiredBlock);
  console.log(desiredBlock);
  if (desiredBlock === undefined) {
    res.json({
      note: "block does not exist"
    });
  } else {
    res.json({
      note: `Block with index ${id} returned`,
      desiredBlock
    });
  }
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}...`);
});
