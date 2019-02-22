const sha256 = require("sha256");

//constructor function
function Blockchain() {
  this.chain = []; //mined blocks will be placed here as a chain
  this.pendingTransactions = []; //before mining the blocks will be placed here
}

//creating a new block
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timeStamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash
  };

  this.pendingTransactions = [];
  this.chain.push(newBlock);

  return newBlock;
};

//get last block
Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length - 1];
};

//creating new/pending transactions to be mined
Blockchain.prototype.crateNewTransaction = function(amount, sender, recipient) {
  const newTransaction = {
    amount,
    sender,
    recipient
  };

  this.pendingTransactions.push(newTransaction);
  return this.getLastBlock()["index"] + 1; //number of the block that the above transaction will be added to
};

//implementing the sah256 hashing algo
Blockchain.prototype.hashBlock = function(
  previousBlockHash,
  currentBlockData,
  nonce
) {
  const dataAsString =
    previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);
  return hash;
};

//proof of work
Blockchain.prototype.proofOfWork = function(
  previousBlockHash,
  currentBlockData
) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  while (hash.substring(0, 4) !== "0000") {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  }

  return nonce; //we get the correct nonce value. our nonce is the proof of work.
};

module.exports = Blockchain;
