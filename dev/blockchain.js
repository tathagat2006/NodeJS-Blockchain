//constructor function
function Blockchain() {
  this.chain = []; //mined blocks will be placed here as a chain
  this.newTransactions = []; //before mining the blocks will be placed here
}

//creating a new block
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timeStamp: Date.now(),
    transactions: this.newTransactions,
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash
  };

  this.newTransactions = [];
  this.chain.push(newBlock);

  return newBlock;
};

module.exports = Blockchain;
