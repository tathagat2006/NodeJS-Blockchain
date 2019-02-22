const Blockchain = require("./blockchain");
const bitcoin = new Blockchain();
const previousBlockHash = "OSDDN83923823DBJKAS";
const currentBlockData = [
  {
    amount: 10,
    sender: "KLKN03023898O90EW",
    recipient: "ONDU3923DBJSABDJ"
  },
  {
    amount: 30,
    sender: "SADAS023898O90EW",
    recipient: "KSJAKSH23DBJSABDJ"
  },
  {
    amount: 40,
    sender: "AJDHAS023898O90EW",
    recipient: "DJAHSD392SDA3SDBJSABDJ"
  }
];

console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));
const nonce = 100;

// bitcoin.createNewBlock(2389, "0YUSJHA973ASHA", "90SAJSASV6246ASHJ");

// bitcoin.crateNewTransaction(100, "ALEX89HJVDHAJVA786", "JEN65567ASGHAVGVDJV09");
// bitcoin.createNewBlock(22329, "0YUDSDSDA7873ASHA", "73HJVDJAS893"); //mining of the block created above

// bitcoin.crateNewTransaction(50, "JHAVSD7834KJD", "KJASDBAK73283723");
// bitcoin.crateNewTransaction(300, "23JHEVDJHADA", "KLNDHBGASVDFYAC3762");
// bitcoin.crateNewTransaction(2000, "GVASYD35723", "DNSBDV232736732");

// bitcoin.createNewBlock(22329, "0YUDSDSDA7873ASHA", "73HJVDJAS893");

// console.log(bitcoin);
// console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));
